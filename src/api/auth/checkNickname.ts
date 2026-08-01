import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

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
    message: "닉네임 중복 확인 응답을 확인해 주세요.",
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
    queryKey: ["get-check-nickname", nickname],
    queryFn: () => GetCheckNickname(nickname),
    staleTime: 1000 * 60,
    ...options,
  });
};
