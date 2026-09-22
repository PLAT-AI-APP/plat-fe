"use client";

import React, { useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ArrowDown } from "@/icons";
import type { FaqItem } from "@/type/qna";

interface FaqAccordionItemProps {
  item: FaqItem;
}

/** 질문 한 줄. 누르면 답변이 펼쳐진다. */
const FaqAccordionItem = ({ item }: FaqAccordionItemProps) => {
  const t = useTranslations("customerService.faq");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className={cn(
        "w-full overflow-hidden rounded-2xl transition-colors",
        isOpen ? "bg-btn-hover" : "bg-dark hover:bg-btn-hover",
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
      >
        <span className="title-5 shrink-0 text-brand">Q</span>
        <span className="body-7 shrink-0 rounded-md bg-card px-2 py-0.5 text-font-2">
          {t(`filters.${item.category}`)}
        </span>
        <strong className="title-5 min-w-0 flex-1 text-font-1">{item.question}</strong>
        <m.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex w-3.5 shrink-0 items-center justify-center p-0.5"
        >
          <ArrowDown className="size-2.5 text-font-2" aria-hidden="true" />
        </m.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="body-6 mx-5 whitespace-pre-wrap break-keep border-t border-main pb-4 pt-4 text-font-1">
              {item.answer}
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </li>
  );
};

export default FaqAccordionItem;
