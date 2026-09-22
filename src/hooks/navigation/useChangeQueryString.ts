import { useCallback } from "react";
import { buildSearchHref, navigateShallow } from "@/lib/shallowUrl";

interface ChangeQueryStringProps {
  updateKey: string;
  updateValue: string;
  /** true=기록을 남김 기본은 false*/
  isHistory?: boolean;
}

/**
 * 현재 경로의 쿼리스트링 하나를 바꾸는 함수를 돌려준다.
 *
 * router.replace 를 쓰면 쿼리만 바뀌어도 서버 렌더를 다시 받아, 보기 전환·정렬 같은 조작이
 * 서버 응답만큼 늦게 반영됐다. 주소만 바꾸고 화면은 useSearchParams 로 따라가게 한다.
 */
export const useChangeQueryString = () =>
  useCallback(
    ({ updateKey, updateValue, isHistory = false }: ChangeQueryStringProps) => {
      navigateShallow(
        buildSearchHref({ [updateKey]: updateValue }),
        isHistory ? "push" : "replace",
      );
    },
    [],
  );
