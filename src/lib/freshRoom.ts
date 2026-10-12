/**
 * 방금 만든 채팅방. 대화 시작 창에서 방을 만들고 넘어가면 표시해 두고, 채팅방이 첫 입장인지 알아본다.
 * 첫 입장이면 시나리오가 막이 오르듯 한 줄씩 올라온다. 다시 들어올 때는 지금처럼 바로 보인다.
 *
 * 화면 상태가 아니라 "방금 일어난 일"이라 모듈에 둔다. 새로고침하면 사라지는 게 맞다.
 */
const createdAt = new Map<string, number>();

/** 만든 뒤 이 안에 들어와야 첫 입장으로 본다(방 화면을 받는 시간 포함) */
const FRESH_WINDOW_MS = 15_000;

export const markRoomFresh = (roomId: string) => {
  createdAt.set(roomId, Date.now());
};

export const isRoomFresh = (roomId: string) => {
  const at = createdAt.get(roomId);
  return at !== undefined && Date.now() - at < FRESH_WINDOW_MS;
};
