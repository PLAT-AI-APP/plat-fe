import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse } from "@/type/api";

interface PostEmailRegisterProps {
  email: string;
  password: string;
  passwordCheck: string;
  emailVerifyToken: string;
}
const PostEmailRegister = async ({
  email,
  emailVerifyToken,
  password,
  passwordCheck,
}: PostEmailRegisterProps) => {
  const response = await axiosInstance.post<
    ApiSuccessResponse<{ signupToken: string }>
  >("/auth/email/register", {
    email: email,
    emailVerifyToken: emailVerifyToken,
    password: password,
    passwordCheck: passwordCheck,
  });

  return {
    serverMessage: response.data.message,
    signupToken: response.data.data.signupToken,
  };
};

/** email 회원가입 요청 */
export const useEmailRegisterMutation = () => {
  return useMutation({
    mutationFn: PostEmailRegister,
  });
};
