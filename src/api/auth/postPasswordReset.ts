import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";

interface PostPasswordResetProps {
  email: string;
  code: string;
  password: string;
  passwordCheck: string;
}

const postPasswordReset = async (props: PostPasswordResetProps) => {
  await axiosInstance.post("/auth/password/reset", props);
};

/** 비밀번호 재설정. 입력칸 오류는 폼이 칸 아래에, 그 밖의 실패는 폼이 토스트로 직접 알린다. */
export const usePasswordResetMutation = () => {
  return useMutation<void, AppError, PostPasswordResetProps>({
    mutationFn: postPasswordReset,
    meta: { silent: true },
  });
};
