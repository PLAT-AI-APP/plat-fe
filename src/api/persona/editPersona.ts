import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";

interface PatchEditPersonaProps {
  personaId: string;
  name: string;
  description: string;
}

const PatchEditPersona = async (props: PatchEditPersonaProps) => {
  await authAxios.patch(`/users/me/personas/${props.personaId}`, props);
};

/** 페르소나 수정 */
export const useEditPersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PatchEditPersonaProps>({
    mutationFn: PatchEditPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-persona-list"] });
    },
  });
};
