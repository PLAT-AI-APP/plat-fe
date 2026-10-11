"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { DocsLocale } from "@/api/docs/types";
import { ArrowDown, Check, Global } from "@/icons";
import { cn } from "@/lib/utils";
import { useDocs } from "./DocsProvider";
import { docsPath, swapDocsLocale } from "./docsPath";

/**
 * 문서 언어 전환. 지금 문서가 고른 언어로도 있으면 같은 문서로, 없으면 그 언어의 홈으로 간다.
 * 홈·검색은 언어와 무관해 같은 화면을 그 언어로 연다.
 */
const DocsLanguageMenu = ({
  variant = "dropdown",
  onNavigate,
}: {
  variant?: "dropdown" | "list";
  onNavigate?: () => void;
}) => {
  const { locale, locales, messages, availableLocales } = useDocs();
  const nameOf = (code: DocsLocale) =>
    locales.find((item) => item.code === code)?.name ?? code.toUpperCase();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const select = (next: DocsLocale) => {
    setIsOpen(false);
    onNavigate?.();
    if (next === locale) return;
    const hasSameDocument = availableLocales === null || availableLocales.includes(next);
    const query = searchParams.toString();
    router.push(
      hasSameDocument
        ? swapDocsLocale(pathname, query ? `?${query}` : "", next)
        : docsPath.home(next),
    );
  };

  const options = (
    <ul role="listbox" aria-label={messages.language} className="flex flex-col py-1">
      {locales.map(({ code: option, name }) => (
        <li key={option} role="option" aria-selected={option === locale}>
          <button
            type="button"
            lang={option}
            onClick={() => select(option)}
            className={cn(
              "body-5 flex w-full items-center justify-between gap-6 px-4 py-2.5 text-left hover:bg-btn-hover",
              option === locale ? "font-semibold text-font-1" : "text-font-2",
            )}
          >
            {name}
            {option === locale && <Check size={16} className="text-brand" aria-hidden="true" />}
          </button>
        </li>
      ))}
    </ul>
  );

  if (variant === "list") {
    return (
      <div className="flex flex-col gap-1">
        <p className="body-7 flex items-center gap-1.5 px-4 text-font-disabled">
          <Global size={14} aria-hidden="true" />
          {messages.language}
        </p>
        {options}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={messages.language}
        onClick={() => setIsOpen((open) => !open)}
        className="body-5 flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-font-1 hover:bg-btn-hover"
      >
        <Global size={18} className="text-font-2" aria-hidden="true" />
        {nameOf(locale)}
        <ArrowDown
          size={16}
          className={cn("text-font-2 transition-transform", isOpen && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 z-30 mt-1 min-w-36 overflow-hidden rounded-xl border border-main bg-dark shadow-popover">
          {options}
        </div>
      )}
    </div>
  );
};

export default DocsLanguageMenu;
