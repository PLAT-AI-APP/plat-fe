import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostAuthRegisterProps {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
  code: string;
}

const PostAuthRegister = async (props: PostAuthRegisterProps) => {
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/auth/signup",
    props,
  );

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 최종 회원가입 */
export const useAuthRegisterMutation = () => {
  return useMutation<
    { serverMessage: string },
    AppError,
    PostAuthRegisterProps
  >({
    mutationFn: PostAuthRegister,
  });
};
