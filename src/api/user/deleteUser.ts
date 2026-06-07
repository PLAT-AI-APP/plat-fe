import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

const deleteUser = async () => {
  const response = await authAxios.delete<ApiSuccessResponse>(`/users/me`);

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 회원탈퇴 */
export const useDeleteUserMutation = () => {
  return useMutation<{ serverMessage: string }, AppError>({
    mutationFn: deleteUser,
  });
};
