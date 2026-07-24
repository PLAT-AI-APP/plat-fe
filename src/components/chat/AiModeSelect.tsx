"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { AIModelType } from "@/type/chat";
import { ModalLayout } from "../ModalLayout";

interface AiModelSelectProps {
  currentAi: AIModelType;
  handleCurrentAi: (model: AIModelType) => void;
}

interface AiModelListItemProps {
  model: AIModelType;
  onSelect: (model: AIModelType) => void;
}

/** 모델 아이콘 배경색 */
const getModelIconClassName = (modelId: string) => {
  if (modelId.includes("Claude")) return "bg-[#d77655]";
  if (modelId.includes("GPT")) return "bg-[#84aca0]";
  if (modelId === "Free") return "bg-brand";

  return "bg-white";
};

const AiModelListItem = ({ model, onSelect }: AiModelListItemProps) => {
  const t = useTranslations();

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(model)}
        className="flex w-full items-center overflow-hidden rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-btn-hover"
      >
        <article className="flex w-full min-w-0 flex-col gap-1">
          <header className="flex w-full gap-3">
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full",
                getModelIconClassName(model.id),
              )}
            >
              <Image
                src={model.icon}
                alt=""
                width={25}
                height={25}
                className="size-[25px] object-contain"
              />
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex min-w-0 items-center gap-2">
                <p className="body-4 truncate text-font-1">{model.id}</p>
                {model.discountRate && (
                  <span className="caption-2 shrink-0 rounded-lg border border-brand bg-brand-opacity px-1.5 py-0.5 text-brand">
                    {model.discountRate}%
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 whitespace-nowrap">
                {model.originalPrice && (
                  <span className="body-2 text-font-disabled line-through">
                    {t("chatUI.modelPrice", { price: model.originalPrice })}
                  </span>
                )}
                <span className="title-3 text-brand">
                  {model.price === 0
                    ? t("chatUI.free")
                    : t("chatUI.modelPrice", { price: model.price })}
                </span>
                {model.price > 0 && (
                  <span className="body-6 text-font-2">/ {model.unit}</span>
                )}
              </div>
            </div>
          </header>

          <p className="body-6 w-full text-font-2">{model.description}</p>
        </article>
      </button>
    </li>
  );
};

const AiModelSelect = ({ currentAi, handleCurrentAi }: AiModelSelectProps) => {
  const t = useTranslations();
  const [isAiModelSelect, setIsAiModelSelect] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const AI_MODELS: AIModelType[] = [
    {
      id: "Gemini 3.1 Pro",
      name: "3.1 Pro",
      description: t("chatUI.gemini31Description"),
      price: 1.2,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Gemini 3.0 Pro",
      name: "3.0 Pro",
      description: t("chatUI.gemini30Description"),
      price: 1,
      originalPrice: 1.2,
      discountRate: 17,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Gemini 2.5 Pro",
      name: "2.5 Pro",
      description: t("chatUI.gemini25Description"),
      price: 1,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "Claude Opus 4.6",
      name: "Opus 4.6",
      description: t("chatUI.claudeOpus46Description"),
      price: 2,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/claude.png",
    },
    {
      id: "Claude Sonnet 4.6",
      name: "Sonnet 4.6",
      description: t("chatUI.claudeSonnet46Description"),
      price: 1.2,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/claude.png",
    },
    {
      id: "Gemini 3 Flash",
      name: "3 Flash",
      description: t("chatUI.gemini3FlashDescription"),
      price: 0.4,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/gemini.png",
    },
    {
      id: "GPT-5.1",
      name: "GPT-5.1",
      description: t("chatUI.gpt51Description"),
      price: 1.1,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/chatgpt.png",
    },
    {
      id: "Free",
      name: "Free",
      description: t("chatUI.freeDescription"),
      price: 0,
      unit: t("chatUI.perChat"),
      icon: "/ai-logo/free.png",
    },
  ];

  const handleSelectModel = (model: AIModelType) => {
    // 선택 후 팝오버를 닫아 헤더 컨트롤 상태를 정리
    handleCurrentAi(model);
    setIsAiModelSelect(false);
  };

  return (
    <nav aria-label={t("chatUI.modelSelect")} className="relative shrink-0">
      <button
        type="button"
        id="ai-model-selector-trigger"
        onClick={() => setIsAiModelSelect((prev) => !prev)}
        ref={triggerRef}
        className="flex h-[34px] min-w-[108px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-border-main bg-[#171D28]/50 py-[5px] pl-2 pr-3 text-font-1 transition-colors hover:bg-btn-hover"
      >
        <Image
          src={currentAi.icon}
          alt={t("chatUI.modelIcon", { name: currentAi.name })}
          width={24}
          height={24}
          className="size-6 rounded-full object-contain"
        />
        <span className="body-4 leading-[1.5]">{currentAi.name}</span>
      </button>

      {isAiModelSelect && (
        <ModalLayout
          onClose={() => setIsAiModelSelect(false)}
          triggerRef={triggerRef}
          className="right-0 top-full h-[500px] w-[360px] translate-y-2.5 overflow-hidden rounded-[24px] border-border-main bg-bg-dark px-2 py-3 shadow-[0px_10px_40px_0px_rgba(0,0,0,0.5)]"
        >
          <ul
            id="ai-model-list"
            className="flex h-full flex-col gap-2 overflow-y-auto pb-3"
          >
            {AI_MODELS.map((model) => (
              <AiModelListItem
                key={model.id}
                model={model}
                onSelect={handleSelectModel}
              />
            ))}
          </ul>
        </ModalLayout>
      )}
    </nav>
  );
};

export default AiModelSelect;
