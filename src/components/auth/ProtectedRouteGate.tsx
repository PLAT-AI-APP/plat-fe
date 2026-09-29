"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import RouteLoading from "@/components/state/RouteLoading";
import StateScene from "@/components/state/StateScene";
import Button from "@/components/ui/Button";
import { isProtectedPath } from "@/constants/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useModalStore } from "@/store/useModalStore";

/**
 * 로그인하지 않은 채 보호 화면에 있을 때 뒤에 깔리는 안내. 로그인 창은 ProtectedNavigationInterceptor 가 띄우지만,
 * 창을 닫으면 로그인이 필요한 화면의 빈 목록·오류가 그대로 보였다. 무엇을 해야 하는지 알려 주고 다시 열 수 있게 한다.
 */
const LoginRequiredScene = () => {
  const t = useTranslations("dialog.loginRequired");
  const openModal = useModalStore((state) => state.openModal);

  return (
    <StateScene
      mood="peek"
      title={t("title")}
      description={t("description")}
      actions={
        <Button
          size="lg"
          fullWidth
          onClick={() => openModal("LOGIN", { triggerRef: undefined })}
        >
          {t("confirm")}
        </Button>
      }
    />
  );
};

const ProtectedRouteGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isProtected = isProtectedPath(pathname);

  // 빈 화면 대신 로딩 화면을 보여 준다. 여기서 null 을 돌려주면 누른 뒤 아무 일도 없는 것처럼 보인다.
  if (isProtected && !isAuthReady) return <RouteLoading />;
  if (isProtected && !isLoggedIn) return <LoginRequiredScene />;

  return children;
};

export default ProtectedRouteGate;
