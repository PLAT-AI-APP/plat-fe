import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

const deleteUser = async () => {
  await authAxios.delete(`/users/me`);
};

/** 회원탈퇴 */
export const useDeleteUserMutation = () => {
  return useMutation<void, AppError>({
    mutationFn: deleteUser,
  });
};
