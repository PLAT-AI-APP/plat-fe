"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import RouteLoading from "@/components/state/RouteLoading";
import { isProtectedPath } from "@/constants/auth";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRouteGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  // 빈 화면 대신 로딩 화면을 보여 준다. 여기서 null 을 돌려주면 누른 뒤 아무 일도 없는 것처럼 보인다.
  if (isProtectedPath(pathname) && !isAuthReady) return <RouteLoading />;

  return children;
};

export default ProtectedRouteGate;
