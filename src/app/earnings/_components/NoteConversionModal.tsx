"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import Token from "@/icons/Token";
import { ModalLayout } from "@/components/ModalLayout";
import Button from "@/components/ui/Button";
import { cn, formatWithCommas } from "@/lib/utils";
import { showAppToast } from "@/lib/toast";
import { usePostNoteConversionMutation } from "@/api/earning/postNoteConversion";

interface NoteConversionModalProps {
  available: number;
  /** 노트 1개당 포인트 */
  noteUnitPrice: number;
  onClose: () => void;
}

/** 수익 포인트를 원하는 만큼 노트로 바꾼다. 받을 노트 수를 넣으면 쓰는 포인트를 바로 보여준다. */
const NoteConversionModal = ({
  available,
  noteUnitPrice,
  onClose,
}: NoteConversionModalProps) => {
  const t = useTranslations("earnings");
  const [input, setInput] = useState("");
  const { mutate: convert, isPending } = usePostNoteConversionMutation();

  const maxNotes = Math.floor(available / noteUnitPrice);
  const notes = Number(input || 0);
  const cost = notes * noteUnitPrice;
  const isOver = notes > maxNotes;
  const canSubmit = notes > 0 && !isOver && !isPending;

  const points = (value: number) =>
    t("points", { value: formatWithCommas(value) });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    convert(
      { notes },
      {
        onSuccess: (redemption) => {
          onClose();
          if (redemption.status === "ISSUED") {
            showAppToast(
              "success",
              t("conversion.done", { count: formatWithCommas(notes) }),
            );
            return;
          }
          // 노트 지급이 늦어지면 재지급 배치가 채운다.
          showAppToast("info", t("conversion.granting"));
        },
      },
    );
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="w-[calc(100%-32px)] max-w-90 p-6"
    >
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-opacity">
            <Token className="size-7" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="title-3">{t("conversion.title")}</h2>
            <span className="body-7 text-font-2">
              {t("conversion.rate", { price: formatWithCommas(noteUnitPrice) })}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="earning-convert-notes" className="body-6 text-font-2">
            {t("conversion.notes")}
          </label>
          <div className="flex gap-2">
            <input
              id="earning-convert-notes"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              autoFocus
              value={input === "" ? "" : formatWithCommas(notes)}
              placeholder="0"
              onChange={(event) =>
                setInput(event.target.value.replace(/\D/g, "").slice(0, 9))
              }
              aria-invalid={isOver}
              className={cn(
                "body-5 h-11 min-w-0 flex-1 rounded-lg border border-main bg-darkest px-4 text-right text-font-1",
                "placeholder:text-font-2/50 focus:border-brand transition-colors",
                isOver && "border-font-accents focus:border-font-accents",
              )}
            />
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setInput(String(maxNotes))}
            >
              {t("conversion.max")}
            </Button>
          </div>
          {isOver && (
            <p className="body-7 text-font-accents">
              {t("conversion.insufficient")}
            </p>
          )}
        </div>

        <dl className="flex flex-col gap-2.5 body-5 rounded-2xl bg-darkest px-4 py-3.5">
          <div className="flex justify-between gap-4">
            <dt className="text-font-2">{t("conversion.usePoints")}</dt>
            <dd className="truncate">{points(cost)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-font-2">{t("conversion.remainPoints")}</dt>
            <dd className="truncate">
              {points(Math.max(available - cost, 0))}
            </dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onClose}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" size="lg" fullWidth disabled={!canSubmit}>
            {t("convert")}
          </Button>
        </div>
      </form>
    </ModalLayout>
  );
};

export default NoteConversionModal;
