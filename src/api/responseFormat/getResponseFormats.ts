import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ResponseFormatOption } from "@/type/chat";
import { useAuthReady } from "@/hooks/data/useAuthReady";

const getResponseFormats = async () => {
  const response = await authAxios.get<ResponseFormatOption[]>("/response-formats");

  return response.data;
};

/** 시나리오에 붙일 수 있는 응답 형식(채팅형·소설형 등). 운영이 가끔 바꾸므로 오래 캐싱한다. */
export const useResponseFormatsQuery = () => {
  const authReady = useAuthReady();

  return useQuery<ResponseFormatOption[], AppError>({
    queryKey: ["response-formats"],
    queryFn: getResponseFormats,
    staleTime: 1000 * 60 * 30,
    enabled: authReady,
  });
};
