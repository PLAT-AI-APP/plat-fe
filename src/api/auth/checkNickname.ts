import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { getApiErrorMessage } from "@/lib/apiError";
import { authQueryKeys } from "./queryKeys";

interface CheckNicknameResponse {
  available: boolean;
}

/** 닉네임 중복 확인 응답 보정 */
const getNormalizedCheckNickname = (
  data?: CheckNicknameResponse,
): CheckNicknameResponse => {
  if (typeof data?.available === "boolean") {
    return data;
  }

  throw {
    code: "MESSAGE",
    fields: {},
    message: getApiErrorMessage("nicknameCheckInvalid"),
  } satisfies AppError;
};

const GetCheckNickname = async (nickname: string) => {
  const response = await authAxios.get<CheckNicknameResponse>(
    `/auth/nickname?nickname=${encodeURIComponent(nickname)}`,
  );

  return getNormalizedCheckNickname(response.data);
};

/** 닉네임 중복 조회 */
export const useCheckNicknameQuery = (
  nickname: string,
  options?: Partial<UseQueryOptions<CheckNicknameResponse, AppError>>,
) => {
  return useQuery<CheckNicknameResponse, AppError>({
    queryKey: authQueryKeys.checkNickname(nickname),
    queryFn: () => GetCheckNickname(nickname),
    staleTime: 1000 * 60,
    ...options,
  });
};
