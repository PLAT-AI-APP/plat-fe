import type { ReactNode } from "react";
import PageWithFooter from "@/components/layout/PageWithFooter";

/** 고객센터(FAQ)와 그 아래 Q&A 화면에 같은 푸터를 붙인다. */
const CustomerServiceLayout = ({ children }: { children: ReactNode }) => (
  <PageWithFooter>{children}</PageWithFooter>
);

export default CustomerServiceLayout;
