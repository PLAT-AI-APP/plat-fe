import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { AppError } from "@/type/api";

interface PostAuthRegisterProps {
  email: string;
  nickname: string;
  password: string;
  passwordCheck: string;
  code: string;
  /** 가입 화면의 동의. 필수 셋이 false 면 서버가 400 으로 거절한다. */
  agreements: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    ageOver14: boolean;
    marketing: boolean;
  };
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
