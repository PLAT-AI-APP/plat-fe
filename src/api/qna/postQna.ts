import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { QnaCreateRequest, QnaCreated } from "@/type/qna";
import { qnaQueryKeys } from "./queryKeys";

const postQna = async (request: QnaCreateRequest) => {
  const response = await authAxios.post<QnaCreated>("/qna", request);

  return response.data;
};

/** 1:1 문의 등록. 성공하면 내 문의 목록을 다시 받는다. */
export const usePostQnaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<QnaCreated, AppError, QnaCreateRequest>({
    mutationFn: postQna,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qnaQueryKeys.mine() });
    },
  });
};
