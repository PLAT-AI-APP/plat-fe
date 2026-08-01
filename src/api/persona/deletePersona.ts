import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

const DeletePersona = async (personaId: string) => {
  await authAxios.delete(`/users/me/personas/${personaId}`);
};

/** 페르소나 삭제 */
export const useDeletePersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationFn: DeletePersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-persona-list"] });
    },
  });
};
