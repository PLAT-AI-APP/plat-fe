import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { getOrCreateDeviceId } from "@/lib/utils";
import { AppError } from "@/type/api";

const PostEmailVerify = async (email: string) => {
  await axiosInstance.post(
    "/auth/email/verify",
    { email },
    {
      headers: {
        "X-Device-ID": getOrCreateDeviceId(),
      },
    },
  );
};

/** 이미 가입된 이메일. 서버가 인증번호를 보내기 전에 거절한다. */
export const EMAIL_UNAVAILABLE_CODE = "EMAIL_UNAVAILABLE";

/**
 * 이메일 인증번호 발송.
 * 실패 안내는 부르는 쪽이 맡는다(전역 토스트 끔) — 이미 가입된 이메일은 입력칸 아래에 알려야 어느 칸이 문제인지 보인다.
 */
export const useEmailVerifyMutation = () => {
  return useMutation<void, AppError, string>({
    mutationFn: PostEmailVerify,
    meta: { silent: true },
  });
};
