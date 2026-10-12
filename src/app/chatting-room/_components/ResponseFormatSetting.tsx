"use client";

import { useId, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useChatModelsQuery } from "@/api/chat/getChatModels";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { usePatchRoomResponseFormatMutation } from "@/api/room/patchRoomResponseFormat";
import { TRANSITION } from "@/constants/motion";
import { useStoredChatModel } from "@/hooks/chat/useStoredChatModel";
import { ArrowDown } from "@/icons";
import Adjust from "@/icons/Adjust";
import { cn } from "@/lib/utils";
import type { ResponseFormatOption } from "@/type/chat";

interface ResponseFormatSettingProps {
  roomId: string;
}

/**
 * 채팅방 설정의 "응답 형식"(채팅형·소설형 등). 한 줄로 지금 형식을 보여 주고, 누르면 펼쳐져 지금 시나리오가 허용하는 형식 중
 * 하나를 고른다. 고르면 방에 저장되어 다음 답변부터 분량과 문체가 바뀌고, 선택한 뒤에는 다시 접힌다. 노트는 쓴 토큰만큼 빠지므로
 * 형식마다 고른 모델의 한 턴 예상 노트를 함께 보여 준다.
 *
 * 형식 이름·설명은 운영이 정하는 값이라 서버가 준 한국어를 그대로 쓴다.
 */
const ResponseFormatSetting = ({ roomId }: ResponseFormatSettingProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const commonT = useTranslations("chatUI");
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const { data: room } = useRoomDetailQuery(roomId);
  const { data: catalog } = useChatModelsQuery();
  const { selectedModelId } = useStoredChatModel(roomId);
  const { mutate: patchResponseFormat } = usePatchRoomResponseFormatMutation();

  const options = room?.allowedResponseFormats ?? [];
  // 헤더의 모델 선택과 같은 규칙: 고른 적이 없거나 카탈로그에서 빠졌으면 첫 모델.
  const model =
    catalog?.models.find((candidate) => candidate.name === selectedModelId) ??
    catalog?.models[0];

  // 고를 것이 하나뿐이면(시나리오가 한 형식만 허용) 바꿀 수 없으니 그리지 않는다.
  if (!room || options.length < 2) return null;

  const current = room.responseFormatCode;
  const currentOption = options.find((option) => option.code === current);

  const getEstimate = (option: ResponseFormatOption) =>
    model?.formatNoteEstimates.find((entry) => entry.responseFormat === option.code)?.estimatedNotes;

  const handleSelect = (option: ResponseFormatOption) => {
    if (option.code !== current) {
      patchResponseFormat({ roomId, responseFormat: option.code });
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
          <span className="whitespace-nowrap">{t("responseFormat")}</span>
        </span>

        <span className="flex items-center gap-1.5">
          {currentOption && <span className="body-6 text-font-2">{currentOption.name}</span>}
          <ArrowDown
            className={cn("size-5 shrink-0 text-font-2 transition-transform", isOpen && "rotate-180")}
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
              <div role="radiogroup" aria-label={t("responseFormat")} className="flex flex-col gap-1.5">
                {options.map((option) => {
                  const isSelected = option.code === current;
                  const estimate = getEstimate(option);

                  return (
                    <button
                      key={option.code}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelect(option)}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors",
                        isSelected
                          ? "border-brand/40 bg-brand-opacity-2"
                          : "border-main/40 bg-darkest hover:bg-btn-hover",
                      )}
                    >
                      <span className="flex min-w-0 flex-col">
                        <span className={cn("body-5", isSelected ? "text-brand" : "text-font-1")}>
                          {option.name}
                        </span>
                        <span className="body-7 text-font-disabled">{option.description}</span>
                      </span>

                      {estimate !== undefined && (
                        <span className={cn("body-6 shrink-0", isSelected ? "text-brand" : "text-font-2")}>
                          {commonT("modelPrice", { price: estimate })}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="body-7 text-font-disabled">{t("responseFormatNotice")}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResponseFormatSetting;
