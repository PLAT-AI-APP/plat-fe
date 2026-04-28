import React from "react";
import UsageHistoryContents from "./_components/UsageHistoryContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "사용 내역",
};

const UsageHistoryPage = () => {
  return <UsageHistoryContents />;
};

export default UsageHistoryPage;
