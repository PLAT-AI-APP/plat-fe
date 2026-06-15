export const FOLLOW_TAB_IDS = ["followers", "following"] as const;

export type FollowTab = (typeof FOLLOW_TAB_IDS)[number];
