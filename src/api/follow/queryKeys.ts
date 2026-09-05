/**
 * 팔로우 관련 캐시 키의 단일 출처.
 *
 * 예전에는 이 문자열들이 컴포넌트 네 곳에 손으로 적혀 있었다. 조회 쪽에서
 * 키를 바꾸면 무효화 쪽은 **컴파일 에러 하나 없이** 조용히 어긋난다.
 * 화면에는 "팔로우는 눌렸는데 숫자는 그대로"로 나타나고, 원인을 찾으려면
 * 문자열을 눈으로 대조하는 수밖에 없다.
 */
export const followQueryKeys = {
  /** 특정 사용자의 팔로워·팔로잉 수 */
  count: (userId: string) => ["get-follow-count", userId] as const,
  /** 내가 팔로우하는 사람 목록 */
  followingList: () => ["get-following-list"] as const,
  /** 나를 팔로우하는 사람 목록 */
  followerList: () => ["get-follower-list"] as const,
} as const;
