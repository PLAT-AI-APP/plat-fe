"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useChatModelsQuery } from "@/api/chat/getChatModels";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { usePatchRoomResponseLengthMutation } from "@/api/room/patchRoomResponseLength";
import { TRANSITION } from "@/constants/motion";
import { useStoredChatModel } from "@/hooks/chat/useStoredChatModel";
import { ArrowDown } from "@/icons";
import Adjust from "@/icons/Adjust";
import { cn } from "@/lib/utils";
import type {
  ChatResponseLength,
  ChatResponseLengthOption,
} from "@/type/chat";
import type { PromptMultiplier } from "@/type/room";

interface ResponseLengthSettingProps {
  roomId: string;
}

/** 서버 문구는 한국어 한 벌이라, 다른 언어는 길이 값으로 번역 키를 찾는다. */
const LABEL_KEYS = {
  SHORT: "responseLengthShort",
  MEDIUM: "responseLengthMedium",
  LONG: "responseLengthLong",
} as const satisfies Record<ChatResponseLength, string>;

const DESCRIPTION_KEYS = {
  SHORT: "responseLengthShortDescription",
  MEDIUM: "responseLengthMediumDescription",
  LONG: "responseLengthLongDescription",
} as const satisfies Record<ChatResponseLength, string>;

/**
 * 채팅방 설정의 "답변 길이". 한 줄로 지금 값을 보여 주고, 누르면 펼쳐져 짧게·보통·길게를 고른다.
 * 고르면 방에 저장되어 이후 모든 답변의 분량과 크레딧이 바뀌고, 선택한 뒤에는 다시 접힌다.
 * 펼친 목록에서 고른 모델의 길이별 요금을 함께 보여 준다.
 *
 * 헤더의 모델 요금은 "보통"(기본 요금) 기준이고, 여기서 길이마다 얼마가 드는지 알 수 있다.
 */
const ResponseLengthSetting = ({ roomId }: ResponseLengthSettingProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const commonT = useTranslations("chatUI");
  const locale = useLocale();
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { data: room } = useRoomDetailQuery(roomId);
  const { data: catalog } = useChatModelsQuery();
  const { selectedModelId } = useStoredChatModel(roomId);
  const { mutate: patchResponseLength } = usePatchRoomResponseLengthMutation();

  const options = catalog?.responseLengths;
  // 헤더의 모델 선택과 같은 규칙: 고른 적이 없거나 카탈로그에서 빠졌으면 첫 모델.
  const model =
    catalog?.models.find((candidate) => candidate.name === selectedModelId) ??
    catalog?.models[0];

  // 서버가 길이 선택지를 주지 않으면(구버전 서버) 그릴 것이 없다.
  if (!options || options.length === 0) return null;

  const current = room?.responseLength ?? null;
  const currentOption = options.find((option) => option.value === current);
  const isCustom = Boolean(room) && current === null;

  const getLabel = (option: ChatResponseLengthOption) =>
    locale === "ko" ? option.label : t(LABEL_KEYS[option.value]);
  const getDescription = (option: ChatResponseLengthOption) =>
    locale === "ko" ? option.description : t(DESCRIPTION_KEYS[option.value]);
  const getNotice = (option: ChatResponseLengthOption) =>
    locale === "ko"
      ? option.creditNotice
      : t("responseLengthNotice", { factor: option.creditMultiplier });

  const getCost = (option: ChatResponseLengthOption) =>
    model?.responseLengthCreditCosts?.find(
      (entry) => entry.responseLength === option.value,
    )?.creditCost;

  const formatCost = (cost: number) =>
    cost === 0 ? commonT("free") : commonT("modelPrice", { price: cost });

  // 접힌 줄에 보이는 현재 값. 예전에 직접 정한 배수는 선택지에 없어 배수를 그대로 보여 준다.
  const summary = currentOption
    ? getLabel(currentOption)
    : isCustom && room
      ? `x${room.multiplier}`
      : "";

  const handleSelect = (option: ChatResponseLengthOption) => {
    // 방 정보를 받기 전에는 지금 값을 몰라 바뀌었는지 알 수 없다.
    if (!room) return;

    if (option.value !== current) {
      patchResponseLength({
        roomId,
        responseLength: option.value,
        multiplier: option.creditMultiplier as PromptMultiplier,
      });
    }

    setIsOpen(false);
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((previous) => !previous)}
        className="body-5 flex w-full items-center justify-between rounded-lg px-2 py-2 text-font-1 transition-colors hover:bg-btn-hover"
      >
        <span className="flex items-center gap-3">
          <Adjust className="size-6 shrink-0 text-font-2" />
          <span className="whitespace-nowrap">{t("responseLength")}</span>
        </span>

        <span className="flex items-center gap-1.5">
          {summary && <span className="body-6 text-font-2">{summary}</span>}
          <ArrowDown
            className={cn(
              "size-5 shrink-0 text-font-2 transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={panelId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 px-2 pb-1 pt-2">
              <div
                role="radiogroup"
                aria-label={t("responseLength")}
                className="flex flex-col gap-1.5"
              >
                {options.map((option) => {
                  const isSelected = option.value === current;
                  const cost = getCost(option);

                  return (
                    <button
                      key={option.value}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={!room}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors disabled:cursor-wait disabled:opacity-50",
                        isSelected
                          ? "border-brand/40 bg-brand-opacity-2"
                          : "border-main/40 bg-darkest hover:bg-btn-hover",
                      )}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span
                          className={cn(
                            "body-5",
                            isSelected ? "text-brand" : "text-font-1",
                          )}
                        >
                          {getLabel(option)}
                        </span>
                        <span className="body-7 text-font-disabled">
                          {getDescription(option)}
                        </span>
                      </span>

                      {cost !== undefined && (
                        <span
                          className={cn(
                            "body-6 shrink-0",
                            isSelected ? "text-brand" : "text-font-2",
                          )}
                        >
                          {formatCost(cost)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {isCustom && room && (
                <p className="body-6 text-font-2">
                  {t("responseLengthCustom", { multiplier: room.multiplier })}
                </p>
              )}
              {currentOption && (
                <p className="body-7 text-font-disabled">
                  {getNotice(currentOption)}
                </p>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponseLengthSetting;
