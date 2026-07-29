import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostPasswordResetProps {
  email: string;
  code: string;
  password: string;
  passwordCheck: string;
}

const postPasswordReset = async (props: PostPasswordResetProps) => {
  await axiosInstance.post<ApiSuccessResponse>("/auth/password/reset", props);
};

/** 비밀번호 재설정 */
export const usePasswordResetMutation = () => {
  return useMutation<void, AppError, PostPasswordResetProps>({
    mutationFn: postPasswordReset,
  });
};
