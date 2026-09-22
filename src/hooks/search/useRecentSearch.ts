import { useCallback, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "recent_searches";
const MAX_COUNT = 10; // 최대 저장 개수
const EMPTY_SNAPSHOT = "[]";

/*
 * 최근 검색어는 브라우저 저장소에 있다. 예전에는 useState 초기값에서 바로 읽어, 서버 HTML(빈 목록)과
 * 클라이언트 첫 렌더(저장된 목록)가 달라 하이드레이션이 어긋났고 React 가 화면을 다시 그리며
 * 깜빡였다. useSyncExternalStore 로 읽으면 하이드레이션 중에는 서버 값(빈 목록)을 쓰고 끝난 뒤
 * 저장값으로 바꾼다. 다른 탭에서 바꾼 것도 따라온다.
 */
const listeners = new Set<() => void>();

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", handleStorage);
  };
};

const readSnapshot = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? EMPTY_SNAPSHOT;
  } catch {
    return EMPTY_SNAPSHOT;
  }
};

const parseKeywords = (snapshot: string): string[] => {
  try {
    const parsed: unknown = JSON.parse(snapshot);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
};

const writeKeywords = (keywords: string[]) => {
  try {
    if (keywords.length === 0) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
  } catch {
    // 저장소를 쓸 수 없는 환경(사생활 보호 모드 등)에서는 이번 화면에서만 사라진다.
  }
  listeners.forEach((listener) => listener());
};

export const useRecentSearch = () => {
  const snapshot = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => EMPTY_SNAPSHOT,
  );
  const keywords = useMemo(() => parseKeywords(snapshot), [snapshot]);

  /** 키워드 저장 함수 **/
  const addKeyword = useCallback((text: string) => {
    if (!text.trim()) return;

    const current = parseKeywords(readSnapshot());
    writeKeywords(
      [
        text,
        ...current.filter((k) => k !== text), // 중복 제거 및 최신화를 위해 기존 동일어 삭제
      ].slice(0, MAX_COUNT), // 최대 개수 제한
    );
  }, []);

  /** 개별 삭제 함수 **/
  const removeKeyword = useCallback((text: string) => {
    writeKeywords(parseKeywords(readSnapshot()).filter((k) => k !== text));
  }, []);

  /** 전체 삭제 함수 **/
  const clearAll = useCallback(() => {
    writeKeywords([]);
  }, []);

  return { keywords, addKeyword, removeKeyword, clearAll };
};
