import React from "react";
import ChattingList from "./ChattingList";

const MyChattingContents = () => {
  return (
    <section className="flex flex-col gap-9 pt-7.5 mx-auto w-full max-w-175">
      <h1 className="heading-2">내 채팅</h1>

      <ChattingList />
    </section>
  );
};

export default MyChattingContents;
