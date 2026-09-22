import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { ReportCreated, ReportCreateRequest } from "@/type/report";
import { reportQueryKeys } from "./queryKeys";

const postReport = async (payload: ReportCreateRequest) => {
  const response = await authAxios.post<ReportCreated>("/reports", payload);

  return response.data;
};

/** 댓글·세계관 신고 접수 */
export const useReportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<ReportCreated, AppError, ReportCreateRequest>({
    mutationKey: ["post-report"],
    mutationFn: postReport,
    // 중복·본인·대상 없음은 신고 모달이 사정에 맞는 문구로 직접 말한다.
    // 전역 토스트까지 뜨면 같은 실패를 서버 문구로 한 번 더 말하게 된다.
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reportQueryKeys.mine() });
    },
  });
};
