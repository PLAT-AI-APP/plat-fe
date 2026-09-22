import { useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { MyReportItem } from "@/type/report";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { reportQueryKeys } from "./queryKeys";

const getMyReport = async (reportId: string) => {
  const response = await authAxios.get<MyReportItem>(`/reports/me/${reportId}`);

  return response.data;
};

/**
 * 내 신고 단건. 알림 딥링크(?reportId=)로 들어왔는데 그 신고가 목록 첫 쪽에 없을 때만 부른다.
 * enabled 를 호출부가 정하는 이유는 목록에서 찾으면 요청할 필요가 없어서다.
 */
export const useMyReportQuery = (reportId: string, enabled: boolean) => {
  const authReady = useAuthReady();

  return useQuery<MyReportItem, AppError>({
    queryKey: reportQueryKeys.myDetail(reportId),
    queryFn: () => getMyReport(reportId),
    enabled: authReady && enabled && Boolean(reportId),
  });
};
