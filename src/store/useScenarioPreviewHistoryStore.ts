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

/** 되돌리기 기록을 끝없이 쌓지 않는다. 항목마다 에셋 이미지 문자열을 들고 있을 수 있다. */
const MAX_HISTORY = 50;

/**
 * 항목을 하나씩 비교한다. 예전에는 두 목록을 통째로 JSON.stringify 해 비교했는데, 에셋 항목의
 * value 는 이미지를 통째로 담은 base64 라(한 장에 수 MB) 추가·삭제·드래그 때마다 수십 MB 를
 * 동기로 직렬화해 화면이 멈췄다. 문자열끼리는 === 로 충분하다.
 */
const areSameContents = (
  previousContents: ScenarioContentItem[],
  nextContents: ScenarioContentItem[],
) =>
  previousContents.length === nextContents.length &&
  previousContents.every((item, index) => {
    const next = nextContents[index];
    return (
      item.id === next.id && item.type === next.type && item.value === next.value
    );
  });

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
              past: [...history.past, cloneContents(previousContents)].slice(
                -MAX_HISTORY,
              ),
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
