import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";
import type { EmailVerifyPurpose } from "./emailVerify";

interface PostEmailVerifyConfirmProps {
  email: string;
  code: string;
  /** 발송 때와 같은 용도여야 서버가 그 인증번호로 확인한다. */
  purpose: EmailVerifyPurpose;
}

/** 인증번호가 틀렸을 때 */
export const VERIFY_CODE_INVALID_CODE = "VERIFY_CODE_INVALID";
/** 인증번호가 만료됐을 때(다시 받아야 한다) */
export const VERIFY_CODE_EXPIRED_CODE = "VERIFY_CODE_EXPIRED";
/** 틀린 횟수를 넘겼을 때(다시 받아야 한다) */
export const VERIFY_CODE_ATTEMPT_EXCEEDED_CODE = "VERIFY_CODE_ATTEMPT_EXCEEDED";

const PostEmailVerifyConfirm = async ({
  code,
  email,
  purpose,
}: PostEmailVerifyConfirmProps) => {
  await axiosInstance.post("/auth/email/verify/confirm", {
    email,
    code,
    purpose,
  });
};

/**
 * 이메일 인증코드 확인.
 * 실패는 인증번호 칸 아래에 사유별로 알린다(부르는 쪽). 전역 토스트까지 뜨면 같은 실패를 두 번 말한다.
 */
export const useEmailVerifyConfirmMutation = () => {
  return useMutation<void, AppError, PostEmailVerifyConfirmProps>({
    mutationFn: PostEmailVerifyConfirm,
    meta: { silent: true },
  });
};
