import React, { Suspense } from "react";
import { Metadata } from "next";
import PaymentResultContents from "./_components/PaymentResultContents";

export const metadata: Metadata = {
  title: "결제",
};

interface PaymentResultPageProps {
  params: Promise<{ provider: string; result: string }>;
}

/** PG 결제창이 끝난 뒤 돌아오는 자리. /payments/{PG}/{success|cancel|fail}?orderUid=... */
const PaymentResultPage = async ({ params }: PaymentResultPageProps) => {
  const { result } = await params;

  return (
    <Suspense>
      <PaymentResultContents result={result} />
    </Suspense>
  );
};

export default PaymentResultPage;
