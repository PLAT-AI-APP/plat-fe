"use client";
import React, { useState } from "react";
import ChatForm from "@/components/chat/ChatForm";
import MessageList from "@/components/chat/MessageList";
import ChattingRoomNotice from "./ChattingRoomNotice";
import { ChatMessageType } from "@/type/chat";
import ChattingRoomHeader from "./ChattingRoomHeader";

const ChattingRoomSection = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      role: "assistant",
      characterName: "윤아",
      profileImage: "/images/sample.png",
      content: `"나 정말 기다렸어. 네가 오늘 꼭 올 줄 알았거든." {img:/images/sample.png} 그녀는 환하게 웃으며 내 소매를 살짝 잡아끌었다.`,
    },
    {
      id: "2",
      role: "user",
      content: "미안해, 차가 좀 막혀서 늦었어. 많이 기다렸지?",
    },
    {
      id: "3",
      role: "assistant",
      characterName: "윤아",
      profileImage: "/images/sample.png",
      content: `"아니야, 나도 방금 나온걸!" {img:/images/sample.png} 그녀는 짐짓 아무렇지 않은 척하며 내 손을 꼭 잡았다. 하지만 그녀의 코끝은 이미 발갛게 얼어 있었다.`,
    },
    {
      id: "4",
      role: "user",
      content: "손이 왜 이렇게 차가워... 일단 어디 들어가서 몸 좀 녹이자.",
    },
    {
      id: "5",
      role: "assistant",
      characterName: "윤아",
      profileImage: "/images/sample.png",
      content: `"저기 창가 자리 어때?" 우리는 근처에 보이는 작은 카페로 들어갔다. 은은한 커피 향과 따뜻한 공기가 우리를 감싸 안았다.`,
    },
    {
      id: "6",
      role: "user",
      content: "그래, 저 자리가 좋겠다. 내가 주문해올게, 뭐 마실래?",
    },
    {
      id: "7",
      role: "assistant",
      characterName: "윤아",
      profileImage: "/images/sample.png",
      content: `"나는 따뜻한 초코 라떼! 휘핑크림도 가득 올려줘." {img:/images/sample.png} 그녀는 아이처럼 들뜬 표정으로 메뉴판을 가리켰다.`,
    },
  ]);

  return (
    <section className="flex justify-center h-[calc(100vh-216.39px)] flex-1 px-4">
      <div className="flex flex-col w-full max-w-3xl h-full">
        {/* 스크롤 영역: 헤더, 공지사항, 메시지 리스트 */}
        <div className="flex-1 overflow-y-auto relative scrollbar-hide pb-4">
          <ChattingRoomHeader
            characterName="윤아"
            onBack={() => console.log("go back")}
          />
          <ChattingRoomNotice />
          <MessageList messages={messages} />
        </div>

        <ChatForm />
      </div>
    </section>
  );
};

export default ChattingRoomSection;
