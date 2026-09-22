import React from "react";
import { Metadata } from "next";
import QnaWriteContents from "./_components/QnaWriteContents";

export const metadata: Metadata = {
  title: "1:1 문의하기",
};

const QnaWritePage = () => <QnaWriteContents />;

export default QnaWritePage;
