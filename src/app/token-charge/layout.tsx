import type { ReactNode } from "react";
import PageWithFooter from "@/components/layout/PageWithFooter";

const TokenChargeLayout = ({ children }: { children: ReactNode }) => (
  <PageWithFooter>{children}</PageWithFooter>
);

export default TokenChargeLayout;
