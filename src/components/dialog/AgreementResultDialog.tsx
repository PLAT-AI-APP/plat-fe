"use client";

import { useLocale, useTranslations } from "next-intl";
import dayjs from "@/lib/dayjs";
import type { AgreementResultDialogProps } from "@/type/dialog";
import Dialog from "./Dialog";

/**
 * 동의·철회 처리 결과 안내. 언제, 무엇에 동의(또는 미동의)했는지를 바로 보여 준다.
 *
 * 광고성 정보 수신 동의·철회는 처리 결과(보낸 곳·일자·내용)를 알려야 한다(정보통신망법 제50조 제7항).
 * 필수 약관도 같은 창에 함께 적어, 사용자가 한 번에 확인하게 한다.
 */
const AgreementResultDialog = ({
  onClose,
  processedAt,
  items,
}: AgreementResultDialogProps) => {
  const t = useTranslations("dialog.agreementResult");
  const locale = useLocale();
  const date = dayjs(processedAt)
    .locale(locale === "zh" ? "zh-cn" : locale)
    .format("YYYY.MM.DD HH:mm");

  return (
    <Dialog
      onClose={onClose}
      label="dialog.agreementResult.title"
      description={
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
                  {item.version && (
                    <span className="ml-1 text-font-2">{item.version}</span>
                  )}
                </span>
                <span
                  className={item.agreed ? "text-brand" : "text-font-disabled"}
                >
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
      }
      confirmText="dialog.agreementResult.confirm"
      confirmFn={onClose}
    />
  );
};

export default AgreementResultDialog;
