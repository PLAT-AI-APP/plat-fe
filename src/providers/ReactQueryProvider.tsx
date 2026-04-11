"use client";

import { ApiErrorResponse } from "@/type/api";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useState를 사용해야 렌더링 시 인스턴스가 새로 생성되는 것을 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            const message =
              axiosError.response?.data?.message || "오류가 발생했습니다.";
            alert(message);
          },
        }),
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
