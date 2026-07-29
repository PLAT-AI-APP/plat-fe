import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostEmailVerifyConfirmProps {
  email: string;
  code: string;
}

const PostEmailVerifyConfirm = async ({
  code,
  email,
}: PostEmailVerifyConfirmProps) => {
  await axiosInstance.post<ApiSuccessResponse>("/auth/email/verify/confirm", {
    email,
    code,
  });
};

/** 이메일 인증코드 확인 */
export const useEmailVerifyConfirmMutation = () => {
  return useMutation<void, AppError, PostEmailVerifyConfirmProps>({
    mutationFn: PostEmailVerifyConfirm,
  });
};
