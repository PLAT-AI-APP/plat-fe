import type { ReactNode } from "react";
import AgreementGate from "@/components/auth/AgreementGate";
import AuthSessionRuntime from "@/components/auth/AuthSessionRuntime";
import PendingAuthDialogs from "@/components/auth/PendingAuthDialogs";
import ProtectedNavigationInterceptor from "@/components/auth/ProtectedNavigationInterceptor";
import AppShell from "@/components/layout/AppShell";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AuthSessionRuntime />
      <ProtectedNavigationInterceptor />
      <PendingAuthDialogs />
      <AgreementGate />

      <AppShell>{children}</AppShell>
    </>
  );
}
