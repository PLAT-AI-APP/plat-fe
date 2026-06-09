import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { getOrCreateDeviceId } from "@/lib/utils";
import { ApiSuccessResponse } from "@/type/api";

const PostEmailVerify = async (email: string) => {
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/auth/email/verify",
    { email: email },
    {
      timeout: 30000,
      headers: {
        "X-Device-ID": getOrCreateDeviceId(),
      },
    },
  );

  return response.data;
};

/** email 인증번호 발송 */
export const useEmailVerifyMutation = () => {
  return useMutation({
    mutationFn: (email: string) => PostEmailVerify(email),
    // onSuccess: (data) => {
    //   if (data.result === "OK") {
    //     alert(data.message || "인증번호가 발송되었습니다.");
    //   }
    // },
  });
};
