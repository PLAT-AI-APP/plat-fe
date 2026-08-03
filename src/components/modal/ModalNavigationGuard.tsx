"use client";

import { useNavigationGuard } from "next-navigation-guard";
import { useModalStore } from "@/store/useModalStore";
import { LOGOUT_REDIRECT_IN_PROGRESS_KEY } from "@/constants/auth";

const ModalNavigationGuard = () => {
  const hasOpenModal = useModalStore((state) => state.modals.length > 0);
  const consumeNextNavigationAllowance = useModalStore(
    (state) => state.consumeNextNavigationAllowance,
  );

  useNavigationGuard({
    enabled: (params) => {
      const isLogoutRedirecting =
        typeof window !== "undefined" &&
        sessionStorage.getItem(LOGOUT_REDIRECT_IN_PROGRESS_KEY) === "true";

      if (isLogoutRedirecting) return false;
      if (!hasOpenModal) return false;
      if (params.type === "beforeunload") {
        return false;
      }

      return true;
    },
    confirm: () => consumeNextNavigationAllowance(),
  });

  return null;
};

export default ModalNavigationGuard;
