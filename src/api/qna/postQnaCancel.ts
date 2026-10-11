import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import { qnaQueryKeys } from "./queryKeys";

const postQnaCancel = async (qnaId: string) => {
  await authAxios.post(`/qna/me/${qnaId}/cancel`);
};

/** 취소 확인 다이얼로그가 진행 상태를 구독하는 키 */
export const CANCEL_QNA_MUTATION_KEY = ["cancel-qna"];

/**
 * 답변 대기 문의 취소. 성공하면 내 문의 목록을 다시 받는다.
 * 실패(이미 답변됨 등)는 전역 토스트가 서버 사유로 알리고, 목록도 다시 받아 지금 상태를 보여 준다.
 */
export const useCancelQnaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AppError, string>({
    mutationKey: CANCEL_QNA_MUTATION_KEY,
    mutationFn: postQnaCancel,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.mine() });
    },
  });
};
