"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY_PREFIX = "chat-room-model:";

/** 어느 방에서든 마지막으로 고른 모델. 아직 고른 적 없는 새 방은 이 값으로 시작한다. */
const LAST_SELECTED_KEY = "chat-last-model";

const getStorageKey = (roomId: string) => `${STORAGE_KEY_PREFIX}${roomId}`;

/** 시크릿 모드·저장소 차단에서는 읽기/쓰기가 예외를 던진다. 그때도 이번 방문 동안은 고른 모델이 유지되게 둔다. */
const memoryStore = new Map<string, string>();

const readKey = (key: string) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) return stored;
  } catch {
    // 저장소를 못 읽으면 이번 방문에 고른 값으로 넘어간다.
  }

  return memoryStore.get(key) ?? null;
};

const writeKey = (key: string, value: string) => {
  memoryStore.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    // 새로고침 뒤까지 기억하지 못할 뿐, 고른 모델은 이 화면에서 그대로 쓰인다.
  }
};

/** 이 방에서 고른 모델, 없으면 다른 방에서 마지막으로 고른 모델. */
const readStoredModelId = (roomId: string) =>
  readKey(getStorageKey(roomId)) ?? readKey(LAST_SELECTED_KEY);

/** 같은 탭에서 고른 값은 storage 이벤트가 오지 않으므로 직접 알린다. */
const listeners = new Set<() => void>();

const subscribe = (onStoreChange: () => void) => {
  listeners.add(onStoreChange);
  // 다른 탭에서 같은 방을 열어 모델을 바꾼 경우
  window.addEventListener("storage", onStoreChange);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
};

/**
 * 방에서 고른 AI 모델을 이 브라우저에 기억합니다.
 *
 * 서버에는 방별 모델을 담을 자리가 없다 — 모델은 방 설정이 아니라 매 턴 POST /chat 에 실어 보내는
 * 값이라, 새로고침하면 목록 첫 모델로 되돌아갔다. 새 방처럼 이 방에서 고른 적이 없으면 마지막으로 고른
 * 모델로 시작한다(매번 첫 모델로 돌아가 다시 고르지 않게). 저장된 모델이 카탈로그에서 사라져도 호출부가
 * 첫 모델로 되돌리므로 여기서는 값만 돌려준다.
 *
 * 저장소는 서버에 없으니 첫 렌더에서는 null 을 돌려주고(하이드레이션 불일치 방지),
 * 마운트 뒤 실제 값으로 바뀐다.
 */
export const useStoredChatModel = (roomId: string) => {
  const selectedModelId = useSyncExternalStore(
    subscribe,
    () => (roomId ? readStoredModelId(roomId) : null),
    () => null,
  );

  const selectModel = useCallback(
    (modelId: string) => {
      if (!roomId) return;

      writeKey(getStorageKey(roomId), modelId);
      writeKey(LAST_SELECTED_KEY, modelId);
      listeners.forEach((listener) => listener());
    },
    [roomId],
  );

  return { selectedModelId, selectModel };
};
