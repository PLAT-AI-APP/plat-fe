import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

const GetCheckNickname = async (nickname: string) => {
  const response = await authAxios.get<
    ApiSuccessResponse<{ available: boolean }>
  >(`/auth/nickname?nickname=${nickname}`);

  return response.data.data;
};

/** 닉네임 중복 조회 */
export const useCheckNicknameQuery = (
  nickname: string,
  options?: Partial<UseQueryOptions<{ available: boolean }, AppError>>,
) => {
  return useQuery<{ available: boolean }, AppError>({
    queryKey: ["get-check-nickname", nickname],
    queryFn: () => GetCheckNickname(nickname),
    staleTime: 1000 * 60,
    ...options,
  });
};
