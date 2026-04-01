import { AIModelType } from "@/type/chat";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { ModalLayout } from "../ModalLayout";

interface AiModelSelectProps {
  currentAi: AIModelType;
  handleCurrentAi: (model: AIModelType) => void;
}

const AiModelSelect = ({ currentAi, handleCurrentAi }: AiModelSelectProps) => {
  const [isAiModelSelect, setIsAiModelSelect] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const AI_MODELS: AIModelType[] = [
    {
      id: "gemini-3.1-pro",
      name: "Gemini 3.1 Pro",
      description: "향상된 성능과 표현력을 갖춘 최신 AI 모델",
      price: 1.2,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "gemini-2.5-pro",
      name: "Gemini 2.5 Pro",
      description: "최신 고성능 AI 모델로 장문의 대화에 적합",
      price: 1,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "gemini-3-flash",
      name: "Gemini 3 Flash",
      description: "빠른 응답과 풍부한 지식을 갖춘 모델",
      price: 0.4,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "claude-opus-4.6",
      name: "Claude Opus 4.6",
      description: "최고 수준의 지능과 창의적인 대화를 제공하는 프리미엄 모델",
      price: 2,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "gemini-3.0-pro",
      name: "Gemini 3.0 Pro",
      description: "몰입도 있는 대화를 즐길 수 있는 최신 AI 모델",
      price: 1,
      originalPrice: 1.2,
      discountRate: 17,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "gemini-4.0-pro",
      name: "Gemini 3.0 Pro",
      description: "몰입도 있는 대화를 즐길 수 있는 최신 AI 모델",
      price: 1,
      originalPrice: 1.2,
      discountRate: 17,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "gemini-5.0-pro",
      name: "Gemini 3.0 Pro",
      description: "몰입도 있는 대화를 즐길 수 있는 최신 AI 모델",
      price: 1,
      originalPrice: 1.2,
      discountRate: 17,
      unit: "채팅",
      icon: "/ai-logo/chatgpt.png",
    },
  ];

  const toggleIsAiModelSelect = () => {
    setIsAiModelSelect(!isAiModelSelect);
  };

  return (
    <nav aria-label="AI 모델 선택">
      <div
        id="ai-model-selector-trigger"
        onClick={toggleIsAiModelSelect}
        ref={triggerRef}
        className="relative hover:bg-btn-hover cursor-pointer flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border-main py-1.25 pl-2 pr-3"
      >
        <Image
          src={currentAi.icon}
          alt={`${currentAi.name} 아이콘`}
          width={24}
          height={24}
          className="min-w-6 h-6 rounded-full"
        />
        <span className="text-sm font-medium">{currentAi.name}</span>

        {isAiModelSelect && (
          <ModalLayout
            onClose={toggleIsAiModelSelect}
            triggerRef={triggerRef}
            className="max-h-119.25 w-90 overflow-y-auto left-0 top-auto bottom-full -translate-y-2.5"
          >
            <ul id="ai-model-list" className="flex flex-col gap-2 p-1">
              {AI_MODELS.map((ai) => (
                <li
                  key={ai.id}
                  onClick={() => handleCurrentAi(ai)}
                  className="flex flex-col w-full gap-1 p-2 rounded-lg hover:bg-btn-hover cursor-pointer"
                >
                  <article>
                    <header className="flex gap-3 items-center">
                      <Image
                        src={ai.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="text-sm flex items-center gap-2 pb-0.5">
                          <strong className="font-semibold">{ai.name}</strong>
                          {ai.discountRate && (
                            <span className="px-1.5 py-0.5 rounded-lg text-[12px] text-brand border border-brand bg-brand-opacity">
                              {ai.discountRate}%
                            </span>
                          )}
                        </div>
                        <div className="flex gap-1 text-xs">
                          {ai.originalPrice && (
                            <span className="text-font-disabled line-through">
                              {ai.originalPrice}
                            </span>
                          )}
                          <span className="text-brand font-medium">
                            {ai.price}코인
                          </span>
                          <span className="text-font-2">/ {ai.unit}</span>
                        </div>
                      </div>
                    </header>
                    <p className="mt-1 text-font-2 text-sm leading-snug">
                      {ai.description}
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </ModalLayout>
        )}
      </div>
    </nav>
  );
};

export default AiModelSelect;
