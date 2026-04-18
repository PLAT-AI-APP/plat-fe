import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostAuthRegisterProps {
  signupToken: string;
  nickname: string;
  birthDate: string;
  gender: string;
}

const PostAuthRegister = async (props: PostAuthRegisterProps) => {
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/auth/register",
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
    onSuccess: (data) => {
      alert(data.serverMessage);
      window.location.href = "/";
    },
  });
};
