"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useFaqListQuery } from "@/api/qna/getFaqList";
import { ChipButton } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { QueryStateBoundary } from "@/components/state";
import { FAQ_CATEGORIES, type FaqCategory } from "@/type/qna";
import CustomerServiceHeader from "./CustomerServiceHeader";
import FaqAccordionItem from "./FaqAccordionItem";

const SKELETON_ITEM_COUNT = 6;

/** 자주 하는 질문. 카테고리 칩으로 거르고, 못 찾으면 1:1 문의로 넘긴다. */
const FaqContents = () => {
  const t = useTranslations("customerService.faq");
  const [category, setCategory] = useState<FaqCategory | "ALL">("ALL");
  const { data, isLoading, isError, error, refetch } = useFaqListQuery();

  const items = (data ?? []).filter(
    (item) => category === "ALL" || item.category === category,
  );

  return (
    <section className="mx-auto flex w-full max-w-155 flex-col gap-6 pt-5">
      <CustomerServiceHeader />

      <div className="flex flex-wrap gap-2">
        {(["ALL", ...FAQ_CATEGORIES] as const).map((id) => (
          <ChipButton
            key={id}
            selected={category === id}
            onClick={() => setCategory(id)}
          >
            {t(`filters.${id}`)}
          </ChipButton>
        ))}
      </div>

      <QueryStateBoundary
        isPending={isLoading}
        isError={isError}
        error={error}
        isEmpty={Boolean(data) && items.length === 0}
        onRetry={refetch}
        emptyMessage={t("empty")}
        emptyMood="peek"
        pendingFallback={
          <ul className="flex flex-col gap-2">
            {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
              <li key={index} className="h-14 w-full rounded-2xl skeleton" />
            ))}
          </ul>
        }
      >
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <FaqAccordionItem key={item.faqId} item={item} />
          ))}
        </ul>
      </QueryStateBoundary>

      <div className="flex items-center justify-between gap-4 rounded-2xl bg-card px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <strong className="title-5 text-font-1">{t("moreHelpTitle")}</strong>
          <p className="body-6 text-font-2">{t("moreHelpDescription")}</p>
        </div>
        <Link
          href="/customer-service/qna/new"
          className={buttonStyles({ variant: "primary", size: "sm" })}
        >
          {t("ask")}
        </Link>
      </div>
    </section>
  );
};

export default FaqContents;
