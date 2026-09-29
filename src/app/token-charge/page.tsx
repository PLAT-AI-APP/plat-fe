import React from "react";
import TokenChargeContents from "./_components/TokenChargeContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "노트 충전",
};
const TokenChargePage = () => {
  return <TokenChargeContents />;
};

export default TokenChargePage;
