import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

const DeletePersona = async (personaId: string) => {
  const response = await authAxios.delete<ApiSuccessResponse>(
    `/users/me/personas/${personaId}`,
  );

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 페르소나 삭제 */
export const useDeletePersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ serverMessage: string }, AppError, string>({
    mutationFn: DeletePersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-persona-list"] });
    },
  });
};
