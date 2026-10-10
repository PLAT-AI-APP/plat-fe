"use client";

import { useLocale, useTranslations } from "next-intl";
import { useChatModelsQuery } from "@/api/chat/getChatModels";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { usePatchRoomResponseLengthMutation } from "@/api/room/patchRoomResponseLength";
import { useStoredChatModel } from "@/hooks/chat/useStoredChatModel";
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
 * 채팅방 설정의 "답변 길이". 짧게·보통·길게 중 하나를 고르면 방에 저장되어 이후 모든 답변의 분량과
 * 크레딧이 바뀐다. 선택 전에 고른 모델의 길이별 요금을 함께 보여 준다.
 *
 * 헤더의 모델 요금은 "보통"(기본 요금) 기준이고, 여기서 길이마다 얼마가 드는지 알 수 있다.
 */
const ResponseLengthSetting = ({ roomId }: ResponseLengthSettingProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const commonT = useTranslations("chatUI");
  const locale = useLocale();
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

  const handleSelect = (option: ChatResponseLengthOption) => {
    // 방 정보를 받기 전에는 지금 값을 몰라 바뀌었는지 알 수 없다.
    if (!room || option.value === current) return;

    patchResponseLength({
      roomId,
      responseLength: option.value,
      multiplier: option.creditMultiplier as PromptMultiplier,
    });
  };

  return (
    <div className="flex flex-col gap-2 px-2 py-2">
      <div className="body-5 flex items-center gap-3 text-font-1">
        <Adjust className="size-6 shrink-0 text-font-2" />
        <span className="whitespace-nowrap">{t("responseLength")}</span>
      </div>

      <div
        role="radiogroup"
        aria-label={t("responseLength")}
        className="grid grid-cols-3 gap-1.5"
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
                "flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 transition-colors disabled:cursor-wait disabled:opacity-50",
                isSelected
                  ? "border-brand/40 bg-brand-opacity-2 text-brand"
                  : "border-main/40 bg-darkest text-font-1 hover:bg-btn-hover",
              )}
            >
              <span className="body-5">{getLabel(option)}</span>
              {cost !== undefined && (
                <span
                  className={cn(
                    "body-7",
                    isSelected ? "text-brand" : "text-font-disabled",
                  )}
                >
                  {formatCost(cost)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-1">
        {currentOption && (
          <p className="body-6 text-font-2">{getDescription(currentOption)}</p>
        )}
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
    </div>
  );
};

export default ResponseLengthSetting;
