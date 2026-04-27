import React from "react";
import TokenChargeContents from "./_components/TokenChargeContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "토큰 충전",
};
const TokenChargePage = () => {
  return <TokenChargeContents />;
};

export default TokenChargePage;
