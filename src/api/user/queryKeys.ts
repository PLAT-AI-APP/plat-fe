const userProfileRootKey = ["get-user-profile"] as const;

/** 유저 관련 캐시 키의 단일 출처. */
export const userQueryKeys = {
  myInfo: () => ["get-my-info"] as const,
  /** 모든 유저의 공개 프로필. 내 프로필을 고친 뒤 통째로 무효화할 때 씁니다. */
  profiles: () => userProfileRootKey,
  /** 특정 유저의 공개 프로필 */
  profile: (userId: string) => [...userProfileRootKey, userId] as const,
  /** 내가 찜한 세계관 목록. 찜·찜 취소 뒤 다시 받아야 해서 무효화하는 쪽과 함께 씁니다. */
  likedUniverses: () => ["get-liked-universes"] as const,
  /**
   * 특정 유저가 만든 세계관 목록. 로그인 여부(liked 유무가 달라진다)가 뒤에 붙어 캐시가 갈리므로,
   * 조회 훅이 이 접두사 뒤에 그 값을 덧붙입니다.
   */
  universes: (userId?: string) => ["get-user-universes", userId] as const,
};
