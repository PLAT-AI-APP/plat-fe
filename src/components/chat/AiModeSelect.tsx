"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AIModelType } from "@/type/chat";
import { ModalLayout } from "../ModalLayout";

interface AiModelSelectProps {
  models: AIModelType[];
  currentAi: AIModelType;
  handleCurrentAi: (model: AIModelType) => void;
}

interface AiModelListItemProps {
  model: AIModelType;
  onSelect: (model: AIModelType) => void;
}

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
            <Image
              src={model.icon}
              alt=""
              width={40}
              height={40}
              className="size-10 shrink-0 rounded-full object-contain"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <div className="flex min-w-0 items-center gap-2">
                <p className="body-5 truncate text-font-1">{model.label}</p>
                {model.discountRate && (
                  <span className="caption-2 shrink-0 rounded-lg border border-brand bg-brand-opacity px-1.5 py-0.5 text-brand">
                    {model.discountRate}%
                  </span>
                )}
              </div>

              {model.price !== undefined && (
                <div className="flex items-center gap-1 whitespace-nowrap">
                  {model.originalPrice && (
                    <span className="body-3 text-font-disabled line-through">
                      {t("chatUI.modelPrice", { price: model.originalPrice })}
                    </span>
                  )}
                  <span className="title-3 text-brand">
                    {model.price === 0
                      ? t("chatUI.free")
                      : t("chatUI.modelPrice", { price: model.price })}
                  </span>
                  {model.price > 0 && model.unit && (
                    <span className="body-7 text-font-2">/ {model.unit}</span>
                  )}
                </div>
              )}
            </div>
          </header>

          {model.descriptionKey && (
            <p className="body-7 w-full text-font-2">
              {t(`chatUI.${model.descriptionKey}`)}
            </p>
          )}
        </article>
      </button>
    </li>
  );
};

const AiModelSelect = ({
  models,
  currentAi,
  handleCurrentAi,
}: AiModelSelectProps) => {
  const t = useTranslations();
  const [isAiModelSelect, setIsAiModelSelect] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

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
        className="flex h-[34px] min-w-[108px] cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-main bg-card/50 py-[5px] pl-2 pr-3 text-font-1 transition-colors hover:bg-btn-hover"
      >
        <Image
          src={currentAi.icon}
          alt={t("chatUI.modelIcon", { name: currentAi.name })}
          width={24}
          height={24}
          className="size-6 rounded-full object-contain"
        />
        <span className="body-5">{currentAi.name}</span>
      </button>

      {isAiModelSelect && (
        <ModalLayout
          onClose={() => setIsAiModelSelect(false)}
          triggerRef={triggerRef}
          className="right-0 top-full h-[min(500px,70dvh)] w-[min(360px,calc(100vw-2rem))] translate-y-2.5 overflow-hidden rounded-3xl border-main bg-dark px-2 py-3"
        >
          <ul
            id="ai-model-list"
            className="flex h-full flex-col gap-2 overflow-y-auto pb-3"
          >
            {models.map((model) => (
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
