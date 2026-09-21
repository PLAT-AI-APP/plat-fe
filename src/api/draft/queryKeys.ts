/** 임시 저장 관련 캐시 키의 단일 출처. */
export const draftQueryKeys = {
  /** 종류(캐릭터·공지 등)별로 현재 임시 저장본이 따로 있다. */
  current: (type: string) => ["get-draft-current", type] as const,
};
