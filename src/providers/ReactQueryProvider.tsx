"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { isAuthExpiredError, notifyApiError } from "@/api";
import { isRetryableError } from "@/lib/apiError";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useState를 사용해야 렌더링 시 인스턴스가 새로 생성되는 것을 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // 에러 토스트는 인터셉터가 아니라 여기서 띄웁니다.
        // QueryCache/MutationCache의 onError는 재시도가 전부 끝나 실패가 확정된 뒤 한 번만 호출되므로,
        // 재시도 도중 매 시도마다 같은 에러 토스트가 중복으로 뜨는 것을 막아줍니다.
        queryCache: new QueryCache({ onError: notifyApiError }),
        mutationCache: new MutationCache({ onError: notifyApiError }),
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
