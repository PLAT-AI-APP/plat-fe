import { create } from "zustand";
import { ScenarioContentItem } from "@/type/character";

interface ScenarioHistory {
  past: ScenarioContentItem[][];
  present: ScenarioContentItem[];
  future: ScenarioContentItem[][];
}

interface ScenarioPreviewHistoryState {
  histories: Record<string, ScenarioHistory>;
  canRedo: (scenarioKey: string) => boolean;
  canUndo: (scenarioKey: string) => boolean;
  recordChange: (
    scenarioKey: string,
    previousContents: ScenarioContentItem[],
    nextContents: ScenarioContentItem[],
  ) => void;
  redo: (scenarioKey: string) => ScenarioContentItem[] | null;
  undo: (scenarioKey: string) => ScenarioContentItem[] | null;
}

const cloneContents = (contents: ScenarioContentItem[]) =>
  contents.map((item) => ({ ...item }));

const areSameContents = (
  previousContents: ScenarioContentItem[],
  nextContents: ScenarioContentItem[],
) => JSON.stringify(previousContents) === JSON.stringify(nextContents);

export const useScenarioPreviewHistoryStore =
  create<ScenarioPreviewHistoryState>((set, get) => ({
    histories: {},

    canRedo: (scenarioKey) =>
      (get().histories[scenarioKey]?.future.length ?? 0) > 0,

    canUndo: (scenarioKey) =>
      (get().histories[scenarioKey]?.past.length ?? 0) > 0,

    recordChange: (scenarioKey, previousContents, nextContents) => {
      if (areSameContents(previousContents, nextContents)) return;

      set((state) => {
        const history = state.histories[scenarioKey] ?? {
          past: [],
          present: cloneContents(previousContents),
          future: [],
        };

        return {
          histories: {
            ...state.histories,
            [scenarioKey]: {
              past: [...history.past, cloneContents(previousContents)],
              present: cloneContents(nextContents),
              // 새 변경이 생기면 되돌린 이후의 기록은 더 이상 이어질 수 없어 비웁니다.
              future: [],
            },
          },
        };
      });
    },

    undo: (scenarioKey) => {
      const history = get().histories[scenarioKey];
      if (!history || history.past.length === 0) return null;

      const previousContents = history.past[history.past.length - 1];
      const nextPast = history.past.slice(0, -1);

      set((state) => ({
        histories: {
          ...state.histories,
          [scenarioKey]: {
            past: nextPast,
            present: cloneContents(previousContents),
            future: [cloneContents(history.present), ...history.future],
          },
        },
      }));

      return cloneContents(previousContents);
    },

    redo: (scenarioKey) => {
      const history = get().histories[scenarioKey];
      if (!history || history.future.length === 0) return null;

      const nextContents = history.future[0];
      const nextFuture = history.future.slice(1);

      set((state) => ({
        histories: {
          ...state.histories,
          [scenarioKey]: {
            past: [...history.past, cloneContents(history.present)],
            present: cloneContents(nextContents),
            future: nextFuture,
          },
        },
      }));

      return cloneContents(nextContents);
    },
  }));
