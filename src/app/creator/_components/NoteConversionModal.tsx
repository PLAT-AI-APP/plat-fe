"use client";

import React, { useState } from "react";
import { m } from "framer-motion";
import { useTranslations } from "next-intl";
import Sparkles from "@/components/motion/Sparkles";
import { EASE_OUT } from "@/constants/motion";
import Token from "@/icons/Token";
import { ModalLayout } from "@/components/ModalLayout";
import Button from "@/components/ui/Button";
import { cn, formatWithCommas } from "@/lib/utils";
import { usePostNoteConversionMutation } from "@/api/earning/postNoteConversion";

interface NoteConversionModalProps {
  available: number;
  /** 노트 1개당 포인트 */
  noteUnitPrice: number;
  onClose: () => void;
}

/** 포인트 점들이 호를 그리며 노트로 흘러 들어간다 */
const POINT_DOTS = Array.from({ length: 9 }, (_, index) => ({
  delay: index * 0.07,
  arc: (index % 3) * 10 - 10,
}));

/** 전환 완료 — 포인트가 노트로 흘러 들어가고 노트가 까딱한다 */
const ConversionDone = ({
  notes,
  onClose,
}: {
  notes: number;
  onClose: () => void;
}) => {
  const t = useTranslations("earnings");
  return (
    <div className="flex flex-col items-center gap-6 pt-2">
      <div
        aria-hidden
        className="relative flex h-24 w-full items-center justify-between px-6"
      >
        <m.span
          className="title-3 flex size-14 items-center justify-center rounded-full bg-card text-font-1"
          animate={{ scale: [1, 0.9, 1], opacity: [1, 0.6, 0.6] }}
          transition={{ duration: 0.8 }}
        >
          P
        </m.span>
        {POINT_DOTS.map((dot, index) => (
          <m.span
            key={index}
            className="absolute top-1/2 left-[52px] size-2 rounded-full bg-[#ffa53c]"
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.6 }}
            animate={{
              x: [0, 100, 210],
              y: [0, -26 + dot.arc, 0],
              opacity: [0, 1, 0],
              scale: [0.6, 1, 0.5],
            }}
            transition={{ delay: dot.delay, duration: 0.6, ease: "easeInOut" }}
          />
        ))}
        <div className="relative">
          <m.div
            animate={{ scale: [1, 1, 1.18, 1], rotate: [0, 0, -10, 0] }}
            transition={{ duration: 1.1, times: [0, 0.55, 0.75, 1] }}
          >
            <Token className="size-14" />
          </m.div>
          <Sparkles
            repeat={false}
            className="-inset-4"
            spots={[
              { top: "0%", left: "80%", size: 12, delay: 0.75 },
              { top: "70%", left: "-6%", size: 9, delay: 0.85 },
            ]}
          />
        </div>
      </div>
      <m.div
        role="status"
        className="flex flex-col items-center gap-1 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4, ease: EASE_OUT }}
      >
        <h2 className="title-2 text-font-1">
          {t("conversion.done", { count: formatWithCommas(notes) })}
        </h2>
        <p className="body-5 text-font-2">{t("conversion.doneDescription")}</p>
      </m.div>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        fullWidth
        onClick={onClose}
      >
        {t("conversion.confirm")}
      </Button>
    </div>
  );
};

/** 수익 포인트를 원하는 만큼 노트로 바꾼다. 받을 노트 수를 넣으면 쓰는 포인트를 바로 보여준다. */
const NoteConversionModal = ({
  available,
  noteUnitPrice,
  onClose,
}: NoteConversionModalProps) => {
  const t = useTranslations("earnings");
  const [input, setInput] = useState("");
  const { mutate: convert, isPending } = usePostNoteConversionMutation();
  // 바로 지급됐으면 모달을 닫지 않고 그 안에서 완료 연출을 보여 준다
  const [convertedNotes, setConvertedNotes] = useState<number>();

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
        // 차감·지급이 한 트랜잭션이라 성공 응답이면 노트가 이미 들어와 있다.
        onSuccess: () => setConvertedNotes(notes),
      },
    );
  };

  return (
    <ModalLayout
      hasBackground
      onClose={onClose}
      className="w-[calc(100%-32px)] max-w-90 p-6"
    >
      {convertedNotes !== undefined ? (
        <ConversionDone notes={convertedNotes} onClose={onClose} />
      ) : (
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-opacity">
              <Token className="size-7" />
            </span>
            <div className="flex min-w-0 flex-col">
              <h2 className="title-3">{t("conversion.title")}</h2>
              <span className="body-7 text-font-2">
                {t("conversion.rate", {
                  price: formatWithCommas(noteUnitPrice),
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="earning-convert-notes"
              className="body-6 text-font-2"
            >
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
      )}
    </ModalLayout>
  );
};

export default NoteConversionModal;
