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

/** 최종 회원가입. 실패는 가입 폼이 칸 아래나 토스트로 직접 알린다(전역 토스트와 겹치지 않게). */
export const useAuthRegisterMutation = () => {
  return useMutation<void, AppError, PostAuthRegisterProps>({
    mutationFn: PostAuthRegister,
    meta: { silent: true },
  });
};
