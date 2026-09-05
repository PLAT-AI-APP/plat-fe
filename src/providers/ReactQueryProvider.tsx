"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { isAuthExpiredError, logApiError, notifyApiError } from "@/api";
import { isAppError, isRetryableError } from "@/lib/apiError";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useState를 사용해야 렌더링 시 인스턴스가 새로 생성되는 것을 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        /*
         * 실패를 어디에 표시할지는 조회와 변경이 서로 다르다.
         *
         * 예전에는 둘 다 notifyApiError 하나에 걸려 있었다. 그래서 화면에
         * ErrorState 를 제대로 그리는 곳에서도 같은 실패가 빨간 토스트로 한 번
         * 더 떴다. 지금 코드에서 그런 곳이 14군데다.
         *
         * 조회(Query)는 화면 어딘가를 채우려고 나간다. 즉 실패에는 이미 주소가
         * 있다 — 비어 버린 그 자리다. 토스트는 지나가면 사라지고, 남는 건
         * 설명 없는 빈 영역이다. 그래서 조회의 기본은 "그 자리에서 알린다"이고
         * 여기서는 기록만 남긴다.
         *
         * 변경(Mutation)은 다르다. 팔로우·삭제·좋아요 같은 것은 성공하면 화면이
         * 조용히 바뀔 뿐 실패를 담을 자리가 없다. 그래서 변경의 기본은 토스트다.
         *
         * onError 는 재시도가 전부 끝나 실패가 확정된 뒤 한 번만 호출되므로,
         * 인터셉터에서 띄울 때처럼 재시도 횟수만큼 중복되지 않는다.
         */
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.silent) return;
            if (query.meta?.toastOnError) {
              notifyApiError(error);
              return;
            }
            logApiError(error);
          },
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.silent) return;
            // 필드별 사유가 온 검증 실패는 해당 입력칸이 말해야 한다.
            // 토스트로 옮기면 어느 칸이 문제인지가 사라진다.
            if (isAppError(error) && Object.keys(error.fields ?? {}).length > 0) {
              logApiError(error);
              return;
            }
            notifyApiError(error);
          },
        }),
        defaultOptions: {
          queries: {
            // 클라이언트에서 하이드레이션 직후 데이터를 다시 가져오는 것을 방지
            staleTime: 1000 * 60 * 5,
            // 창 포커스 시 재요청 비활성화 (개발 중 콘솔 중복 방지)
            refetchOnWindowFocus: false,
            // 다시 물어도 답이 같은 실패는 재시도하지 않습니다. 404·400 을 세 번 더 두드려 봐야
            // 사용자에게 "없다"는 안내만 그만큼 늦게 뜹니다. 네트워크·타임아웃·5xx 만 다시 봅니다.
            // 401/403 은 axios 인터셉터가 이미 refresh-token 재시도를 한 번 마친 결과라 여기서 또 걸러냅니다.
            retry: (failureCount, error) =>
              !isAuthExpiredError(error) &&
              isRetryableError(error) &&
              failureCount < 3,
          },
        },
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
