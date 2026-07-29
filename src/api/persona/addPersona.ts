import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostAddPersonaProps {
  name: string;
  description: string;
}

const PostAddPersona = async (props: PostAddPersonaProps) => {
  await authAxios.post<ApiSuccessResponse>("/users/me/personas", props);
};

/** 페르소나 추가 */
export const useAddPersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, PostAddPersonaProps>({
    mutationFn: PostAddPersona,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me-persona-list"] });
    },
  });
};
