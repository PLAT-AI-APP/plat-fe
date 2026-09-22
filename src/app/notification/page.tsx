import type { Metadata } from "next";
import { connection } from "next/server";
import React from "react";
import NotificationContents from "./_components/NotificationContents";

export const metadata: Metadata = {
  title: "Notice",
};

// 필터는 NotificationContents 가 주소에서 직접 읽는다. 요청마다 렌더해 첫 HTML 에 목록 틀이 들어가게 한다.
const NotificationPage = async () => {
  await connection();

  return <NotificationContents />;
};

export default NotificationPage;
