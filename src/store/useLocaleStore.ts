import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppLocale, DEFAULT_LOCALE } from "@/i18n/config";

interface LocaleState {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: "locale-storage",
    },
  ),
);
