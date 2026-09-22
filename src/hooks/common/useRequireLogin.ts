"use client";

import { useCallback } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

/**
 * 로그인이 필요한 동작 앞에서 부르는 확인 함수를 돌려준다.
 *
 * 비로그인이면 로그인 창을 열고 false 를 돌려준다. 요청을 그냥 보내면 401 로 조용히 실패해
 * 눌러도 아무 일이 없는 것처럼 보이므로, 서버에 가기 전에 여기서 막는다.
 *
 * 로그인이 필요한 "모달"은 useModalStore 가 알아서 막으므로, 모달 없이 바로 요청을 보내는
 * 버튼(찜·팔로우·좋아요 등)에서 쓴다.
 *
 * @example
 * const requireLogin = useRequireLogin();
 * const handleLike = () => {
 *   if (!requireLogin()) return;
 *   like();
 * };
 */
export const useRequireLogin = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openModal = useModalStore((state) => state.openModal);

  return useCallback(() => {
    if (isLoggedIn) return true;

    openModal("LOGIN", { triggerRef: undefined });
    return false;
  }, [isLoggedIn, openModal]);
};
