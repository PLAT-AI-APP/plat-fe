"use client";

import { useNavigationGuard } from "next-navigation-guard";
import { useModalStore } from "@/store/useModalStore";

const ModalNavigationGuard = () => {
  const hasOpenModal = useModalStore((state) => state.modals.length > 0);
  const consumeNextNavigationAllowance = useModalStore(
    (state) => state.consumeNextNavigationAllowance,
  );

  useNavigationGuard({
    enabled: (params) => {
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
