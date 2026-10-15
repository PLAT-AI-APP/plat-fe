"use client";

import { useTranslations } from "next-intl";
import { useRoomDetailQuery } from "@/api/room/getRoomDetail";
import { usePatchRoomResponseLengthMutation } from "@/api/room/patchRoomResponseLength";
import NoteLine from "@/icons/NoteLine";
import { cn } from "@/lib/utils";
import { RESPONSE_LENGTHS, type ResponseLength } from "@/type/room";

interface ResponseLengthSettingProps {
  roomId: string;
}

/** 길이 값별 번역 키. 서버는 값만 주므로 문구는 화면이 가진다. */
const LABEL_KEYS = {
  SHORT: "responseLengthShort",
  MEDIUM: "responseLengthMedium",
  LONG: "responseLengthLong",
} as const satisfies Record<ResponseLength, string>;

/** 서버가 선택값을 비워 줄 때(미설정) 쓰는 기본 길이. */
const DEFAULT_RESPONSE_LENGTH: ResponseLength = "MEDIUM";

/**
 * 채팅방 설정의 "답변 길이". 짧게·보통·길게를 한 줄 세그먼트로 고른다.
 *
 * 소설형(NOVEL)에서만 의미가 있어, 다른 형식의 방이거나 방 정보를 받기 전에는 그리지 않는다.
 * 길이별 가격은 서버가 따로 주지 않아 숫자 대신 "길수록 비용이 늘어날 수 있다"는 안내만 둔다.
 */
const ResponseLengthSetting = ({ roomId }: ResponseLengthSettingProps) => {
  const t = useTranslations("chatRoom.sidebar");
  const { data: room } = useRoomDetailQuery(roomId);
  const { mutate: patchResponseLength } = usePatchRoomResponseLengthMutation();

  if (!room || room.responseFormatCode !== "NOVEL") return null;

  const current = room.responseLength ?? DEFAULT_RESPONSE_LENGTH;

  const handleSelect = (length: ResponseLength) => {
    if (length === current) return;

    patchResponseLength({ roomId, responseLength: length });
  };

  return (
    <div className="flex flex-col gap-1 px-2 py-2">
      <div className="flex items-center justify-between gap-3">
        <span className="body-5 flex items-center gap-3 text-font-1">
          <NoteLine className="size-6 shrink-0 text-font-2" />
          <span className="whitespace-nowrap">{t("responseLength")}</span>
        </span>

        <div
          role="radiogroup"
          aria-label={t("responseLength")}
          className="flex shrink-0 rounded-full border border-main/40 bg-darkest p-0.5"
        >
          {RESPONSE_LENGTHS.map((length) => {
            const isSelected = length === current;

            return (
              <button
                key={length}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(length)}
                className={cn(
                  "body-6 rounded-full px-3.5 py-1.5 transition-colors",
                  isSelected
                    ? "bg-brand font-semibold text-on-brand"
                    : "text-font-2 hover:text-font-1",
                )}
              >
                {t(LABEL_KEYS[length])}
              </button>
            );
          })}
        </div>
      </div>

      <p className="body-7 text-right text-font-disabled">
        {t("responseLengthNotice")}
      </p>
    </div>
  );
};

export default ResponseLengthSetting;
