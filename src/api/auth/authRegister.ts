import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";

interface PostAuthRegisterProps {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
  code: string;
}

const PostAuthRegister = async (props: PostAuthRegisterProps) => {
  await axiosInstance.post("/auth/signup", props);
};

/** 최종 회원가입 */
export const useAuthRegisterMutation = () => {
  return useMutation<void, AppError, PostAuthRegisterProps>({
    mutationFn: PostAuthRegister,
  });
};
