import React from "react";

interface ChattingItemInfoProps {
  title: string;
  lastMessage: string;
}

const ChattingItemInfo = ({ title, lastMessage }: ChattingItemInfoProps) => {
  return (
    <section className="flex flex-col min-w-0">
      <p className="font-medium truncate">{title}</p>
      <p className="text-font-2 line-clamp-1 text-sm">{lastMessage}</p>
    </section>
  );
};

export default ChattingItemInfo;
