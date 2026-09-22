"use client";

import { useUserStore } from "@/store/useUserStore";

/**
 * {{user}} 자리에 채워 넣을 표시용 이름.
 *
 * 비로그인은 아직 정해진 이름이 없는 상태라, 임의의 대체 문구로 채우면 실제로
 * 그 이름을 쓰는 것처럼 오해할 수 있습니다. 그래서 undefined 를 돌려주고,
 * segmentsToDisplayText 가 {{user}} 토큰을 원문 그대로 남기게 합니다.
 */
export const useUserDisplayName = () =>
  useUserStore((state) => state.user?.nickname);
