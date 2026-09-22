import React from "react";
import { Metadata } from "next";
import FaqContents from "./_components/FaqContents";

export const metadata: Metadata = {
  title: "고객센터",
};

const CustomerServicePage = () => <FaqContents />;

export default CustomerServicePage;
