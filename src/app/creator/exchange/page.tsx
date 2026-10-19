import React from "react";
import { Metadata } from "next";
import ExchangeContents from "./ExchangeContents";

export const metadata: Metadata = {
  title: "교환",
};

const ExchangePage = () => <ExchangeContents />;

export default ExchangePage;
