"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  LOGOUT_REDIRECT_IN_PROGRESS_KEY,
  PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
  PENDING_WELCOME_CREDIT_DIALOG_KEY,
} from "@/constants/auth";
import { useDialogStore } from "@/store/useDialogStore";
import { useModalStore } from "@/store/useModalStore";
import type { SignupCompleteDialogProps } from "@/type/dialog";

const PendingAuthDialogs = () => {
  const pathname = usePathname();
  const clearModals = useModalStore((state) => state.clearModals);
  const openModal = useModalStore((state) => state.openModal);
  const openDialog = useDialogStore((state) => state.openDialog);

  useEffect(() => {
    if (pathname !== "/") return;

    const isLogoutRedirecting =
      sessionStorage.getItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY) === "true";

    if (isLogoutRedirecting) {
      sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);
      sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);
      return;
    }

    const pendingSignupCompleteDialog = sessionStorage.getItem(
      PENDING_SIGNUP_COMPLETE_DIALOG_KEY,
    );

    if (pendingSignupCompleteDialog) {
      sessionStorage.removeItem(PENDING_SIGNUP_COMPLETE_DIALOG_KEY);

      // 저장소 값은 다른 코드·확장 프로그램이 바꿀 수 있다. 깨진 값이면 가입 완료 안내만 기본 문구로 띄운다.
      let parsedDialogData: {
        nickname?: string;
        agreement?: SignupCompleteDialogProps["agreement"];
      } = {};
      try {
        const parsed: unknown = JSON.parse(pendingSignupCompleteDialog);
        if (parsed && typeof parsed === "object") {
          parsedDialogData = parsed as typeof parsedDialogData;
        }
      } catch {
        parsedDialogData = {};
      }

      clearModals();
      openDialog("SIGNUP_COMPLETE", {
        nickname: parsedDialogData.nickname || "",
        agreement: parsedDialogData.agreement,
        onLogin: () => {
          openModal("LOGIN", { triggerRef: undefined });
        },
      });
      return;
    }

    const shouldOpenWelcomeDialog =
      sessionStorage.getItem(PENDING_WELCOME_CREDIT_DIALOG_KEY) === "true";

    if (shouldOpenWelcomeDialog) {
      sessionStorage.removeItem(PENDING_WELCOME_CREDIT_DIALOG_KEY);
      openDialog("WELCOME_CREDIT", {});
    }
  }, [clearModals, openDialog, openModal, pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    sessionStorage.removeItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY);
  }, [pathname]);

  return null;
};

export default PendingAuthDialogs;
