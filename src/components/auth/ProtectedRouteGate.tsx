"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { isProtectedPath } from "@/constants/auth";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRouteGate = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const isAuthReady = useAuthStore((state) => state.isAuthReady);

  if (isProtectedPath(pathname) && !isAuthReady) return null;

  return children;
};

export default ProtectedRouteGate;
