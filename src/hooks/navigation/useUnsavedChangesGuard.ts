"use client";

import { useCallback, useEffect, useRef } from "react";
import { useNavigationGuard } from "next-navigation-guard";
import { useDialogStore } from "@/store/useDialogStore";
import { useUnsavedChangesFallbackGuard } from "./useUnsavedChangesFallbackGuard";

/**
 * 쓰던 글이 있는 화면을 떠나려 하면 "저장하지 않은 변경" 확인 창을 띄운다.
 *
 * router.push 이동은 next-navigation-guard 가, 링크 클릭·브라우저 뒤로가기는 useUnsavedChangesFallbackGuard 가
 * 잡는다(캐릭터 제작 화면과 같은 조합). 제출에 성공해 스스로 떠날 때는 allowLeave() 를 먼저 부른다.
 */
export const useUnsavedChangesGuard = ({ isDirty }: { isDirty: boolean }) => {
  const openDialog = useDialogStore((state) => state.openDialog);
  const isLeaveAllowedRef = useRef(false);
  // 확인 창에서 "나가기"를 누르면 가려던 곳으로 보낸다. 아래 훅의 반환값을 콜백 안에서 쓰려고 ref 로 잇는다.
  const leaveRef = useRef<(targetPath: string) => void>(() => undefined);

  const confirmLeave = useCallback(
    (targetPath: string) => {
      openDialog("UNSAVED_CHANGES", {
        onCancel: () => undefined,
        onLeave: () => leaveRef.current(targetPath),
      });
    },
    [openDialog],
  );

  const { leaveToBlockedTarget, isLeavingRef } = useUnsavedChangesFallbackGuard({
    isDirty,
    onBlockedByBack: confirmLeave,
  });
  useEffect(() => {
    leaveRef.current = leaveToBlockedTarget;
  }, [leaveToBlockedTarget]);

  useNavigationGuard({
    enabled: (info) => {
      if (isLeavingRef.current || isLeaveAllowedRef.current) return false;
      // 뒤로가기는 useUnsavedChangesFallbackGuard 가 맡는다. 둘이 함께 다루면 순서가 엉킨다.
      if (info.type === "popstate") return false;
      return isDirty;
    },
    confirm: (info) => {
      confirmLeave(info.to);
      return false;
    },
  });

  /** 제출 성공 뒤처럼 의도한 이동은 묻지 않고 보낸다. */
  const allowLeave = useCallback(() => {
    isLeaveAllowedRef.current = true;
  }, []);

  return { allowLeave };
};
