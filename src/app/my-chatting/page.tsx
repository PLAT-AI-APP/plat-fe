import React from "react";
import MyChattingContents from "./_components/MyChattingContents";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "내 채팅",
};

const MyChattingPage = () => {
  return <MyChattingContents />;
};

export default MyChattingPage;
