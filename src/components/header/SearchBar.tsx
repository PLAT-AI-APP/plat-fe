"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Search } from "@/icons";

export const SearchBar = () => {
  const t = useTranslations();
  const router = useRouter();

  return (
    <button
      id="search-icon-button"
      type="button"
      aria-label={t("searchBar.placeholder")}
      onClick={() => router.push("/search")}
      className="flex size-10 items-center justify-center rounded-xl text-font-2 transition-colors hover:bg-btn-hover"
    >
      <Search id="icon-search-glass" className="size-6" />
    </button>
  );
};
