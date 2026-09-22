import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { personaQueryKeys } from "./queryKeys";

const DeletePersona = async (personaId: string) => {
  await authAxios.delete(`/users/me/personas/${personaId}`);
};

/** 삭제 확인 다이얼로그가 진행 상태를 구독하는 키 */
export const DELETE_PERSONA_MUTATION_KEY = ["delete-persona"];

/** 페르소나 삭제 */
export const useDeletePersonaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: DELETE_PERSONA_MUTATION_KEY,
    mutationFn: DeletePersona,
    // 실패 사유는 삭제 확인 다이얼로그 안에서 말한다. 전역 토스트까지 뜨면
    // 같은 내용을 두 번 말하면서, 정작 눈이 가 있는 다이얼로그는 아무 말이 없다.
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: personaQueryKeys.myList() });
    },
  });
};
