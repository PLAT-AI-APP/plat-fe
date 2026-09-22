"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "faq", href: "/customer-service" },
  { key: "qna", href: "/customer-service/qna" },
] as const;

/** 고객센터 공통 머리. 자주 하는 질문과 나의 Q&A 를 오가는 탭을 둔다. */
const CustomerServiceHeader = () => {
  const t = useTranslations("customerService");
  const pathname = usePathname();
  // 문의 작성(/customer-service/qna/new)도 나의 Q&A 탭에 속한다.
  const activeKey = pathname.startsWith("/customer-service/qna") ? "qna" : "faq";

  return (
    <header className="flex flex-col gap-5">
      <h1 className="heading-2">{t("title")}</h1>

      <nav>
        <ul className="flex gap-5 border-b border-main">
          {TABS.map((tab) => (
            <li key={tab.key}>
              <Link
                href={tab.href}
                aria-current={activeKey === tab.key ? "page" : undefined}
                className={cn(
                  "title-5 -mb-px block border-b-2 pb-2.5 transition-colors",
                  activeKey === tab.key
                    ? "border-font-1 text-font-1"
                    : "border-transparent text-font-2 hover:text-font-1",
                )}
              >
                {t(`tabs.${tab.key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default CustomerServiceHeader;
