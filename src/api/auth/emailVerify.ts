import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { getOrCreateDeviceId } from "@/lib/utils";
import { ApiSuccessResponse, AppError } from "@/type/api";

const PostEmailVerify = async (email: string) => {
  await axiosInstance.post<ApiSuccessResponse>(
    "/auth/email/verify",
    { email },
    {
      headers: {
        "X-Device-ID": getOrCreateDeviceId(),
      },
    },
  );
};

/** 이메일 인증번호 발송 */
export const useEmailVerifyMutation = () => {
  return useMutation<void, AppError, string>({
    mutationFn: PostEmailVerify,
  });
};
