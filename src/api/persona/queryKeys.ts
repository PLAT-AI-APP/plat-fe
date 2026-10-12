/** 페르소나 관련 캐시 키의 단일 출처. */
export const personaQueryKeys = {
  myList: () => ["me-persona-list"] as const,
  /** 모든 페르소나 상세. 이름을 고친 뒤 채팅방처럼 상세를 쓰는 화면이 새 이름을 받게 통째로 무효화한다. */
  details: () => ["get-persona-detail"] as const,
  detail: (personaId: string) => ["get-persona-detail", personaId] as const,
};
