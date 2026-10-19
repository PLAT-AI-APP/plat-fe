"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { isServerOutageError } from "@/lib/apiError";
import ErrorState from "./ErrorState";

interface ServerOutageContextValue {
  report: (id: string, error: unknown) => void;
  clear: (id: string) => void;
}

const ServerOutageContext = createContext<ServerOutageContextValue | null>(
  null,
);

/**
 * 서버에 닿지 못한 실패(타임아웃·연결 끊김)를 페이지 단위로 하나로 모은다.
 *
 * 서버가 느려지면 홈처럼 섹션이 여럿인 화면은 섹션마다 같은 문구를 띄웠다.
 * 이 경계 안의 ErrorState 는 그런 실패를 직접 그리지 않고 여기에 알리고,
 * 경계는 섹션을 모두 숨긴 채 문구 하나만 보여준다. 섹션은 숨겨도 마운트를
 * 유지해서, 다시 시도해 성공하면 저절로 원래 화면으로 돌아온다.
 */
const ServerOutageBoundary = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<ReadonlyMap<string, unknown>>(
    () => new Map(),
  );

  const report = useCallback((id: string, error: unknown) => {
    setErrors((prev) => {
      if (prev.get(id) === error) return prev;
      const next = new Map(prev);
      next.set(id, error);
      return next;
    });
  }, []);

  const clear = useCallback((id: string) => {
    setErrors((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ report, clear }), [report, clear]);
  const firstError = errors.values().next().value;
  const hasOutage = errors.size > 0;

  const retryAll = () => {
    void queryClient.refetchQueries({
      type: "active",
      predicate: (query) => query.state.status === "error",
    });
  };

  // 통합 문구는 Provider 밖에 둔다. 안에 두면 그 ErrorState 도 경계에 위임하고 사라진다.
  return (
    <>
      {hasOutage && (
        <ErrorState
          error={firstError}
          onRetry={retryAll}
          forceRetry
          className="min-h-[60vh]"
        />
      )}
      <ServerOutageContext.Provider value={value}>
        <div className={cn(hasOutage ? "hidden" : "contents")}>{children}</div>
      </ServerOutageContext.Provider>
    </>
  );
};

/**
 * ErrorState 가 쓰는 훅. 경계 안이고 서버에 닿지 못한 실패면 경계에 알리고 true 를 돌려준다.
 * true 면 그 자리에는 아무것도 그리지 않는다.
 */
export const useServerOutageReport = (error: unknown): boolean => {
  const context = useContext(ServerOutageContext);
  const id = useId();
  const isDelegated = Boolean(context) && isServerOutageError(error);

  useEffect(() => {
    if (!context || !isDelegated) return;
    context.report(id, error);
    return () => context.clear(id);
  }, [context, error, id, isDelegated]);

  return isDelegated;
};

export default ServerOutageBoundary;
