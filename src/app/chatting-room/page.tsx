"use client";
// import React, { useCallback, useState } from "react";
// import ChattingListSection from "./_components/ChattingListSection";
// import { ChatListItemType } from "@/type/chat";
import ChattingRoomSection from "./_components/chatting-room-section";

const ChattingRoomPage = () => {
  // const [currentChat, setCurrentChat] = useState<ChatListItemType>({
  //   id: 1,
  //   title: "진짜 롤레가 여자'TS'가 됐다",
  //   scenario:
  //     "병원 특유의 소독약 냄새와 낯선 천장의 풍경이 눈앞에 들어왔다. 몸이 왜 이렇게 무겁고 어색한지, 거울 속의 나는 내가 알던 모습이 아니었다.\n\n 대체 나에게 무슨 일이 일어난 걸까",
  //   lastMessage: "대체 나에게 무슨 일이 일어난 걸까?",
  //   time: "9시간 전",
  //   profileImage: "/public/images/sample.png",
  //   isPinned: true,
  // });

  // const handleCurrentChat = useCallback((item: ChatListItemType) => {
  //   setCurrentChat(item);
  // }, []);

  return (
    <section className="flex gap-4 h-[calc(100vh-60px)]">
      {/* <ChattingListSection
        currentChat={currentChat}
        handleCurrentChat={handleCurrentChat}
      /> */}
      <ChattingRoomSection />
    </section>
  );
};

export default ChattingRoomPage;
