"use client";

import { useEffect } from "react";
import { preloadModal } from "@/components/modal/ModalRegistry";
import { runWhenIdle } from "@/lib/idle";
import type { ModalTypeMap } from "@/store/useModalStore";

/**
 * 이 화면에서 곧 열릴 가능성이 큰 모달의 코드를 한가할 때 미리 받는다.
 * 모달은 열 때 청크를 받으므로, 첫 클릭에서 잠깐 아무 반응이 없던 것을 없앤다.
 * (예: 캐릭터 상세의 "대화 시작", 내 프로필의 "프로필 수정")
 */
export const usePreloadModalsWhenIdle = (
  types: readonly (keyof ModalTypeMap)[],
  enabled = true,
) => {
  const key = types.join(",");

  useEffect(() => {
    if (!enabled || !key) return;
    return runWhenIdle(() => {
      key.split(",").forEach((type) => preloadModal(type as keyof ModalTypeMap));
    });
  }, [key, enabled]);
};
