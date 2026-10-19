import { useInfiniteQuery } from "@tanstack/react-query";
import { authAxios } from "..";
import { AppError } from "@/type/api";
import type { EarningCalendarDayUniverses } from "@/type/earning";
import { useAuthReady } from "@/hooks/data/useAuthReady";
import { earningQueryKeys } from "./queryKeys";

/** 처음 5개, 더 보기마다 10개. */
export const CALENDAR_DAY_FIRST_SIZE = 5;
export const CALENDAR_DAY_PAGE_SIZE = 10;

const getEarningCalendarDay = async (date: string, offset: number) => {
  const response = await authAxios.get<EarningCalendarDayUniverses>(
    `/earnings/calendar/${date}/universes`,
    {
      params: {
        offset,
        limit: offset === 0 ? CALENDAR_DAY_FIRST_SIZE : CALENDAR_DAY_PAGE_SIZE,
      },
    },
  );
  return response.data;
};

/**
 * 고른 날(YYYY-MM-DD)의 캐릭터별 수익. 날을 고르지 않았으면 부르지 않는다.
 * {@code selection} 은 고를 때마다 바뀌는 값이라, 같은 날을 다시 골라도 처음 5개부터 다시 받는다.
 */
export const useEarningCalendarDayQuery = (
  date: string | null,
  selection: number,
) => {
  const authReady = useAuthReady();

  return useInfiniteQuery<EarningCalendarDayUniverses, AppError>({
    queryKey: earningQueryKeys.calendarDay(date ?? "", selection),
    initialPageParam: 0,
    queryFn: ({ pageParam = 0 }) =>
      getEarningCalendarDay(date as string, pageParam as number),
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasNext
        ? pages.reduce((count, page) => count + page.items.length, 0)
        : undefined,
    enabled: authReady && date !== null,
  });
};
