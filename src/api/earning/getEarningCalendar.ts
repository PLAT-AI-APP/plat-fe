import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { EarningCalendar } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

const getEarningCalendar = async (month: string) => {
  const response = await authAxios.get<EarningCalendar>("/earnings/calendar", {
    params: { month },
  });
  return response.data;
};

/** 수익 캘린더 한 달(YYYY-MM). 달을 넘길 때 칸이 비지 않도록 새 달이 올 때까지 이전 달을 둔다. */
export const useEarningCalendarQuery = (month: string) => {
  const authReady = useAuthReady();

  return useQuery<EarningCalendar, AppError>({
    queryKey: earningQueryKeys.calendar(month),
    queryFn: () => getEarningCalendar(month),
    enabled: authReady,
    placeholderData: keepPreviousData,
  });
};
