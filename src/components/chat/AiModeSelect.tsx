"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AIModelType } from "@/type/chat";
import { ModalLayout } from "../ModalLayout";

interface AiModelSelectProps {
  currentAi: AIModelType;
  handleCurrentAi: (model: AIModelType) => void;
}

const AiModelSelect = ({ currentAi, handleCurrentAi }: AiModelSelectProps) => {
  const t = useTranslations();
  const [isAiModelSelect, setIsAiModelSelect] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const AI_MODELS: AIModelType[] = [
    {
      id: "Gemini 3.1 Pro",
      name: "3.1 Pro",
      description: "향상된 성능과 표현력을 갖춘 최신 AI 모델",
      price: 1.2,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Gemini 3.0 Pro",
      name: "3.0 Pro",
      description: "몰입도 있는 대화를 즐길 수 있는 최신 AI 모델",
      price: 1,
      originalPrice: 1.2,
      discountRate: 17,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Gemini 2.5 Pro",
      name: "2.5 Pro",
      description: "최신 고성능 AI 모델로 장문의 대화에 적합",
      price: 1,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Gemini 3 Flash",
      name: "3 Flash",
      description: "빠른 응답과 풍부한 지식을 갖춘 모델",
      price: 0.4,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Claude Opus 4.6",
      name: "Opus 4.6",
      description:
        "최고 수준의 지능과 창의적인 대화를 제공하는 프리미엄 모델",
      price: 2,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/claude.png",
    },
    {
      id: "Claude Sonnet 4.6",
      name: "Sonnet 4.6",
      description: "자연스럽고 창의적인 대화를 제공하는 고급 모델",
      price: 1.2,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/claude.png",
    },
    {
      id: "GPT-5.1",
      name: "GPT-5.1",
      description: "풍부한 감정선과 섬세한 표현이 강점인 모델",
      price: 1.1,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "Free",
      name: "Free",
      description: "균형잡힌 속도와 이해도를 가진 안전한 대화 모델",
      price: 0,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/free.png",
    },
  ];

  return (
    <nav aria-label={t("chatUI.modelSelect")}>
      <div
        id="ai-model-selector-trigger"
        onClick={() => setIsAiModelSelect((prev) => !prev)}
        ref={triggerRef}
        className="relative flex cursor-pointer items-center gap-2.5 whitespace-nowrap rounded-full border border-border-main py-1.25 pl-2 pr-3 hover:bg-btn-hover"
      >
        <Image
          src={currentAi.icon}
          alt={t("chatUI.modelIcon", { name: currentAi.name })}
          width={24}
          height={24}
          className="h-6 min-w-6 rounded-full"
        />
        <span className="body-4">{currentAi.name}</span>

        {isAiModelSelect && (
          <ModalLayout
            onClose={() => setIsAiModelSelect(false)}
            triggerRef={triggerRef}
            className="left-0 top-auto bottom-full max-h-119.25 w-90 -translate-y-2.5 overflow-y-auto"
          >
            <ul id="ai-model-list" className="flex flex-col gap-2 p-1">
              {AI_MODELS.map((ai) => (
                <li
                  key={ai.id}
                  onClick={() => handleCurrentAi(ai)}
                  className="flex w-full cursor-pointer flex-col gap-1 rounded-lg p-2 hover:bg-btn-hover"
                >
                  <article>
                    <header className="flex items-center gap-3">
                      <Image
                        src={ai.icon}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 pb-0.5 text-sm">
                          <strong className="body-4">{ai.id}</strong>
                          {ai.discountRate && (
                            <span className="rounded-lg border border-brand bg-brand-opacity px-1.5 py-0.5 text-[12px] text-brand">
                              {ai.discountRate}%
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {ai.originalPrice && (
                            <span className="body-2 text-font-disabled line-through">
                              {ai.originalPrice}
                            </span>
                          )}
                          <span className="title-3 text-brand">
                            {ai.price}
                            {t("chatUI.coin")}
                          </span>
                          <span className="body-6 text-font-2">
                            / {ai.unit}
                          </span>
                        </div>
                      </div>
                    </header>
                    <p className="body-6 mt-1 leading-snug text-font-2">
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
