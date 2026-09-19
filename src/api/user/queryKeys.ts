/** 내 정보 관련 캐시 키의 단일 출처. */
export const userQueryKeys = {
  myInfo: () => ["get-my-info"] as const,
  /** 모든 유저의 공개 프로필. 내 프로필을 고친 뒤 통째로 무효화할 때 씁니다. */
  profiles: () => ["get-user-profile"] as const,
  /** 특정 유저의 공개 프로필 */
  profile: (userId: string) => ["get-user-profile", userId] as const,
};
