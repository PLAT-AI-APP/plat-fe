import React from "react";
import ChattingList from "./ChattingList";

interface MyChattingContentsProps {
  id: string;
}
const MyChattingContents = ({ id }: MyChattingContentsProps) => {
  return (
    <section className="flex flex-col gap-9 pt-7.5 mx-auto w-full max-w-175">
      <h1 className="font-medium text-3xl">내 채팅</h1>

      <ChattingList />
    </section>
  );
};

export default MyChattingContents;
