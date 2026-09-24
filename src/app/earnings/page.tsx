import React from "react";
import { Metadata } from "next";
import EarningsContents from "./_components/EarningsContents";

export const metadata: Metadata = {
  title: "수익",
};

const EarningsPage = () => {
  return <EarningsContents />;
};

export default EarningsPage;
