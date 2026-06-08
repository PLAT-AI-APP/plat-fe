"use client";

import { useNavigationGuard } from "next-navigation-guard";
import { useModalStore } from "@/store/useModalStore";

const ModalNavigationGuard = () => {
  const hasOpenModal = useModalStore((state) => state.modals.length > 0);

  useNavigationGuard({
    enabled: hasOpenModal,
    confirm: () => false,
  });

  return null;
};

export default ModalNavigationGuard;
