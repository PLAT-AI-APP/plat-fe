"use client";

import { useTranslations } from "next-intl";
import { Close, CloseLine, Search } from "@/icons";

interface SearchQueryBarProps {
  queryDraft: string;
  onQueryDraftChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  keywords: string[];
  onKeywordClick: (keyword: string) => void;
  onKeywordRemove: (keyword: string) => void;
  onClearAll: () => void;
}

const SearchQueryBar = ({
  queryDraft,
  onQueryDraftChange,
  onSubmit,
  keywords,
  onKeywordClick,
  onKeywordRemove,
  onClearAll,
}: SearchQueryBarProps) => {
  const t = useTranslations();

  return (
    <div className="flex flex-col gap-2.5">
      <form
        onSubmit={onSubmit}
        className="flex items-center justify-between rounded-2xl border border-main bg-darkest px-4 py-3 transition-colors focus-within:field-focus!"
      >
        <div className="flex flex-1 items-center gap-3">
          <Search className="size-7 shrink-0 text-font-disabled" />
          <span className="body-2 text-font-disabled">|</span>
          <input
            value={queryDraft}
            onChange={(event) => onQueryDraftChange(event.target.value)}
            placeholder={t("searchBar.placeholder")}
            aria-label={t("searchBar.placeholder")}
            className="focus-ring-none body-3 w-full bg-transparent text-font-1 outline-none placeholder:text-font-disabled"
          />
        </div>

        <button
          type="button"
          aria-label={t("searchResults.close")}
          onClick={() => onQueryDraftChange("")}
          className="flex size-7 shrink-0 items-center justify-center opacity-24 transition-opacity hover:opacity-60"
        >
          <Close className="size-4 text-font-2" />
        </button>
      </form>

      {keywords.length > 0 && (
        <div className="flex items-center justify-between px-0.5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="body-5 text-font-2">
              {t("searchBar.recentTitle")}
            </span>
            <span className="body-5 text-font-disabled">|</span>

            <ul className="flex flex-wrap items-center gap-2">
              {keywords.map((keyword) => (
                <li
                  key={keyword}
                  onClick={() => onKeywordClick(keyword)}
                  className="body-5 flex cursor-pointer items-center gap-1 rounded-lg bg-card py-2 pl-3 pr-2 text-font-2"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onKeywordRemove(keyword);
                    }}
                    className="flex size-[18px] items-center justify-center text-font-2 hover:text-font-1"
                  >
                    <CloseLine className="size-[18px] text-font-2" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={onClearAll}
            className="body-5 text-font-disabled underline decoration-from-font hover:text-font-2"
          >
            {t("searchBar.clearAll")}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchQueryBar;
