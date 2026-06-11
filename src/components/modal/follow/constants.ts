// 탭 id는 API query 선택에도 쓰이므로 문자열을 한곳에서만 관리합니다.
export const FOLLOW_TABS = [
  { id: "followers", title: "팔로워" },
  { id: "following", title: "팔로잉" },
] as const;

export type FollowTab = (typeof FOLLOW_TABS)[number]["id"];
