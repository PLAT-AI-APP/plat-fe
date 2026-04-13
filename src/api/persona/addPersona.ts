import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "..";
import { ApiSuccessResponse, AppError } from "@/type/api";

interface PostAddPersonaProps {
  name: string;
  description: string;
}

const PostAddPersona = async (props: PostAddPersonaProps) => {
  const response = await axiosInstance.post<ApiSuccessResponse>(
    "/users/me/personas",
    props,
  );

  return {
    serverMessage: response.data.message ?? "",
  };
};

/** 페르소나 추가 */
export const useAddPersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<{ serverMessage: string }, AppError, PostAddPersonaProps>({
    mutationFn: PostAddPersona,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me-persona-list"] });
    },
  });
};
