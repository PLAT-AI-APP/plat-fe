import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { getOrCreateDeviceId } from "@/lib/utils";
import { AppError } from "@/type/api";

/**
 * 인증번호를 무엇에 쓰는지. 서버는 용도별로 따로 발급·확인한다(BE↔FE 계약 1번).
 * - SIGNUP: 가입. 이미 가입된 이메일이면 EMAIL_UNAVAILABLE 로 거절한다.
 * - PASSWORD_RESET: 비밀번호 재설정. 가입된 이메일 계정일 때만 실제로 보내지만, 응답은 어느 쪽이든 204 다(가입 여부 노출 방지).
 */
export type EmailVerifyPurpose = "SIGNUP" | "PASSWORD_RESET";

interface PostEmailVerifyParams {
  email: string;
  purpose: EmailVerifyPurpose;
}

const PostEmailVerify = async ({ email, purpose }: PostEmailVerifyParams) => {
  await axiosInstance.post(
    "/auth/email/verify",
    { email, purpose },
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
  return useMutation<void, AppError, PostEmailVerifyParams>({
    mutationFn: PostEmailVerify,
    meta: { silent: true },
  });
};
