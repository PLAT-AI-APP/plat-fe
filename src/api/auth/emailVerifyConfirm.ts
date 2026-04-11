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
  const response = await axiosInstance.post<
    ApiSuccessResponse<{
      emailVerifyToken: string;
    }>
  >("/auth/email/verify/confirm", { email: email, code: code });

  return {
    token: response.data.data?.emailVerifyToken,
    serverMessage: response.data.message, // 서버에서 보내준 "인증에 성공하였습니다."
  };
};

/** email 인증코드 확인 */
export const useEmailVerifyConfirmMutation = () => {
  return useMutation({
    mutationFn: ({ code, email }: PostemailVerifyConfirmProps) =>
      PostemailVerifyConfirm({ email, code }),
    onSuccess: (data) => {
      alert(data.serverMessage || "인증번호가 발송되었습니다.");
    },
  });
};
