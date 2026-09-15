import { createFollowListQuery } from "./createFollowListQuery";
import { followQueryKeys } from "./queryKeys";

/** 사용자의 팔로잉 목록 조회 */
export const useFollowingListQuery = createFollowListQuery(
  "following",
  followQueryKeys.followingList(),
);
