import type { ReactNode } from "react";
import AuthSessionRuntime from "@/components/auth/AuthSessionRuntime";
import PendingAuthDialogs from "@/components/auth/PendingAuthDialogs";
import ProtectedNavigationInterceptor from "@/components/auth/ProtectedNavigationInterceptor";
import ProtectedRouteGate from "@/components/auth/ProtectedRouteGate";
import AppShell from "@/components/layout/AppShell";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthSessionRuntime />
      <ProtectedNavigationInterceptor />
      <PendingAuthDialogs />

      <ProtectedRouteGate>
        <AppShell>{children}</AppShell>
      </ProtectedRouteGate>
    </>
  );
}
