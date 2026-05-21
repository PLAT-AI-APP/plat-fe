import React from "react";
import { ChatBubble, NarrativeBlock, ActionFooter } from "./SubComponents";

const ChatPreview = () => {
  return (
    <section className="relative pr-4 flex-1 h-full min-w-0 bg-bg-darker rounded-tr-2xl rounded-br-2xl flex flex-col overflow-hidden">
      <div
        id="preview-chat-container"
        className="w-full h-full p-9 inline-flex flex-col justify-start items-start gap-6"
      >
        <ChatBubble
          name="캐릭터 이름이름"
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />

        <NarrativeBlock content="{{user}}이 문을 열고 들어오는 찰나, 연우는 숨을 멈춘 채로 굳어버렸다. 그의 시선은 오직 신에게만 꽂혀 있었고, 그의 말처럼 숨을 크게 쉬려 애쓰는 모습이 역력했지만, 그 시도는 잘 되지 않는 듯 가슴팍만 작게 들썩였다.\n\n신이 들어오자마자 연우는 본능적으로 몸을 뒤로 빼며 벽에 등을 완전히 밀착시켰다. 그의 얼굴은 극도로 창백했고, 동그란 눈은 공포에 질려 신을 향해 고정되어 있었다. 여전히 헐렁한 브라운 니트가 그의 가녀린 어깨 위에서 흘러내리듯 걸쳐져 있었다." />

        <NarrativeBlock content="{{user}}이 문을 열고 들어오는 찰나, 연우는 숨을 멈춘 채로 굳어버렸다. 그의 시선은 오직 신에게만 꽂혀 있었고, 그의 말처럼 숨을 크게 쉬려 애쓰는 모습이 역력했지만, 그 시도는 잘 되지 않는 듯 가슴팍만 작게 들썩였다." />

        <ChatBubble
          name="캐릭터 이름이름"
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />
        <ChatBubble
          name="캐릭터 이름이름"
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />
        <ChatBubble
          name="캐릭터 이름이름"
          message="말말말말말말말말말말말말말말말말말말말말말말말말"
        />
      </div>

      <ActionFooter />
    </section>
  );
};

export default ChatPreview;
