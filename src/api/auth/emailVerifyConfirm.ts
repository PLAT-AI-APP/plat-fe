import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse } from "@/type/api";

interface PostemailVerifyConfirmProps {
  email: string;
  code: string;
}
const PostemailVerifyConfirm = async ({
  code,
  email,
}: PostemailVerifyConfirmProps) => {
  console.log(code);
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/auth/email/verify/confirm",
    { email: email, code: code },
  );

  return response.data;
};

/** email 인증코드 확인 */
export const useEmailVerifyConfirmMutation = () => {
  return useMutation({
    mutationFn: ({ code, email }: PostemailVerifyConfirmProps) =>
      PostemailVerifyConfirm({ email, code }),
    onSuccess: (data) => {
      if (data.result === "OK") {
        alert(data.message || "인증번호가 발송되었습니다.");
      }
    },
  });
};
