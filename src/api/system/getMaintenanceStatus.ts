import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "..";
import type { AppError } from "@/type/api";

/**
 * 점검 단계. 판정은 서버가 시각으로 한다.
 * - OPEN: 평소. 나머지 칸은 null 이다.
 * - NOTICE: 점검 예정. 상단에 예고를 띄운다.
 * - DRAINING: 소프트 종료. 새 요청은 503 이고, 이미 시작한 결제 승인·채팅 스트림만 끝까지 간다.
 * - CLOSED: 점검 중. 사용자 요청은 모두 503 이다.
 */
export type MaintenancePhase = "OPEN" | "NOTICE" | "DRAINING" | "CLOSED";

export interface MaintenanceStatus {
  phase: MaintenancePhase;
  /** 새 요청을 막기 시작하는 시각(UTC ISO). */
  drainStartsAt: string | null;
  /** 점검 시작(완전 종료) 시각. */
  closesAt: string | null;
  /** 안내용 예상 종료. 실제로는 운영자가 점검을 끝낼 때 열린다. */
  expectedEndsAt: string | null;
  message: string | null;
}

export const maintenanceStatusQueryKey = ["system", "maintenance"] as const;

const getMaintenanceStatus = async () => {
  const response =
    await axiosInstance.get<MaintenanceStatus>("/system/maintenance");

  return response.data;
};

/**
 * 점검 상태. 로그인 없이 부르고, 점검 중에도 열려 있는 API 다.
 *
 * 예고는 보통 몇 시간 전에 걸리므로 1분 간격이면 충분하다. 실패해도 화면을 막지 않는다 —
 * 서버가 정말 막히면 다른 요청의 503 이 점검 화면으로 보낸다.
 */
export const useMaintenanceStatusQuery = ({
  refetchInterval = 60_000,
}: { refetchInterval?: number } = {}) =>
  useQuery<MaintenanceStatus, AppError>({
    queryKey: maintenanceStatusQueryKey,
    queryFn: getMaintenanceStatus,
    staleTime: 30_000,
    refetchInterval,
    retry: false,
    meta: { silent: true },
  });
