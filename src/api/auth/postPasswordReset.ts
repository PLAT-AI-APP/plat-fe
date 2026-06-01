import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostPasswordResetProps {
  email: string;
  code: string;
  password: string;
  passwordCheck: string;
}
const postPasswordReset = async (props: PostPasswordResetProps) => {
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/auth/password/reset",
    props,
  );

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 비밀번호 찾기 api */
export const usePasswordResetMutation = () => {
  return useMutation<
    { serverMessage: string },
    AppError,
    PostPasswordResetProps
  >({
    mutationFn: (props) => postPasswordReset(props),
  });
};
