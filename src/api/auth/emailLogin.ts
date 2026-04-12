import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostEmailLoginProps {
  email: string;
  password: string;
}

const PostEmailLogin = async (props: PostEmailLoginProps) => {
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/auth/email/login",
    props,
  );

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 이메일 로그인 */
export const useEmailLoginMutation = () => {
  return useMutation<{ serverMessage: string }, AppError, PostEmailLoginProps>({
    mutationFn: PostEmailLogin,
  });
};
