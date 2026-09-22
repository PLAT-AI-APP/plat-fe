import React from "react";
import { Metadata } from "next";
import MyQnaContents from "./_components/MyQnaContents";

export const metadata: Metadata = {
  title: "나의 Q&A",
};

const MyQnaPage = () => <MyQnaContents />;

export default MyQnaPage;
