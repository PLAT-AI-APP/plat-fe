"use client";
import React from "react";
import { Info } from "@/icons";

const ChattingRoomNotice = () => {
  return (
    <p className="text-[12px] flex items-center justify-center gap-1 pb-5.75 pt-4">
      <Info className="w-5 h-5" />
      캐릭터가 보내는 메시지는 모두 생성된 내용이에요
    </p>
  );
};

export default ChattingRoomNotice;
