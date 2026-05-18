import { useMutation } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";
import { useRouter } from "next/navigation";

const deleteUser = async () => {
  const response = await authAxios.delete<ApiSuccessResponse>(`/users/me`);

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 회원탈퇴 */
export const useDeleteUserMutation = () => {
  const router = useRouter();
  return useMutation<{ serverMessage: string }, AppError, string>({
    mutationFn: deleteUser,
    onSuccess: () => {
      router.refresh();
      router.push("/");
    },
  });
};
