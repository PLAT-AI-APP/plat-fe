"use client";

import { useLocale, useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import type { AgreementResultItem } from "@/type/dialog";

interface AgreementResultSummaryProps {
  /** 처리 시각(ISO). */
  processedAt: string;
  items: AgreementResultItem[];
}

/**
 * 언제, 무엇에 동의(미동의·철회)했는지와 보낸 곳. 동의 결과 창과 가입 완료 창이 함께 쓴다.
 *
 * 광고성 정보 수신 동의·철회는 처리 결과(보낸 곳·일자·내용)를 알려야 한다(정보통신망법 제50조 제7항).
 */
const AgreementResultSummary = ({
  processedAt,
  items,
}: AgreementResultSummaryProps) => {
  const t = useTranslations("dialog.agreementResult");
  const locale = useLocale();
  const date = dayjs(processedAt)
    .locale(locale === "zh" ? "zh-cn" : locale)
    .format("YYYY.MM.DD HH:mm");

  return (
    <div
      id="agreement-result"
      className="body-5 flex w-full flex-col gap-3 text-font-2"
    >
      <p>{t("description", { date })}</p>
      <ul className="flex flex-col gap-1.5 rounded-xl bg-darker px-4 py-3">
        {items.map((item) => (
          <li
            key={item.type}
            className="flex items-center justify-between gap-3"
          >
            <span className="text-font-1">
              {t(`items.${item.type}`)}
            </span>
            <span className={item.agreed ? "text-brand" : "text-font-disabled"}>
              {t(
                item.agreed
                  ? "agreed"
                  : item.withdrawn
                    ? "withdrawn"
                    : "declined",
              )}
            </span>
          </li>
        ))}
      </ul>
      <p className="body-6 text-font-disabled">{t("sender")}</p>
    </div>
  );
};

export default AgreementResultSummary;
