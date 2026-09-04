import { create } from "zustand";
import { persist } from "zustand/middleware";

/** 백엔드 UniverseTendency 와 문자열이 같다. 그대로 쿼리 파라미터로 나간다. */
export type Tendency = "ALL" | "MALE_ORIENTED" | "FEMALE_ORIENTED";

export const DEFAULT_TENDENCY: Tendency = "ALL";

interface TendencyState {
  tendency: Tendency;
  setTendency: (tendency: Tendency) => void;
}

export const useTendencyStore = create<TendencyState>()(
  persist(
    (set) => ({
      tendency: DEFAULT_TENDENCY,
      setTendency: (tendency) => set({ tendency }),
    }),
    {
      name: "tendency-storage",
    },
  ),
);
