import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

const deleteUser = async () => {
  await authAxios.delete<ApiSuccessResponse>(`/users/me`);
};

/** 회원탈퇴 */
export const useDeleteUserMutation = () => {
  return useMutation<void, AppError>({
    mutationFn: deleteUser,
  });
};
