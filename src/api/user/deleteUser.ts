import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

/** 진행 상태를 다른 컴포넌트에서도 구독할 수 있도록 키를 공유합니다. */
export const DELETE_USER_MUTATION_KEY = ["delete-user"];

const deleteUser = async () => {
  await authAxios.delete(`/users/me`);
};

/** 회원탈퇴 */
export const useDeleteUserMutation = () => {
  return useMutation<void, AppError>({
    mutationKey: DELETE_USER_MUTATION_KEY,
    mutationFn: deleteUser,
  });
};
