import React from "react";
import { Metadata } from "next";
import EarningsContents from "./_components/EarningsContents";

export const metadata: Metadata = {
  title: "크리에이터 센터",
};

const EarningsPage = () => {
  return <EarningsContents />;
};

export default EarningsPage;
