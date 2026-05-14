import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PatchEditPersonaProps {
  personaId: string;
  name: string;
  description: string;
}

const PatchEditPersona = async (props: PatchEditPersonaProps) => {
  const response = await authAxios.patch<ApiSuccessResponse>(
    `/users/me/personas/${props.personaId}`,
    props,
  );

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 페르소나 추가 */
export const useEditPersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<
    { serverMessage: string },
    AppError,
    PatchEditPersonaProps
  >({
    mutationFn: PatchEditPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-persona-list"] });
    },
  });
};
