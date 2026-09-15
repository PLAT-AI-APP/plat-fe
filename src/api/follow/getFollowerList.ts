import { createFollowListQuery } from "./createFollowListQuery";
import { followQueryKeys } from "./queryKeys";

/** 사용자의 팔로워 목록 조회 */
export const useFollowerListQuery = createFollowListQuery(
  "followers",
  followQueryKeys.followerList(),
);
