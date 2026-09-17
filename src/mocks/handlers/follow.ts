import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";

interface MockFollowUser {
  userId: string;
  profileImageUrl: string | null;
  nickname: string;
}

const createMockUsers = (
  prefix: string,
  startId: number,
  count: number,
): MockFollowUser[] =>
  Array.from({ length: count }, (_, index) => ({
    userId: String(startId + index),
    profileImageUrl: "/p1.png",
    nickname: `${prefix}_${index + 1}`,
  }));

/** user.ts 의 mockUser.id 와 동일 — "나"를 가리키는 고정 ID입니다. */
const CURRENT_USER_ID = "1234567890123456789";

const MOCK_FOLLOWERS = createMockUsers("팔로워", 2000, 24);
/** 내가 팔로우한 사람 목록. POST/DELETE /follow/{userId} 결과가 그대로 이어집니다. */
let followingList = createMockUsers("팔로잉", 1000, 24);

const isFollowing = (userId: string) =>
  followingList.some((user) => user.userId === userId);

/** 백엔드 PageWith<FollowResponse> 구조와 동일하게 응답 */
const createPageResponse = (
  list: MockFollowUser[],
  page: number,
  size: number,
) => {
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / size);
  const start = page * size;
  const end = start + size;

  return {
    content: list.slice(start, end),
    page: {
      number: page,
      size,
      numberOfElements: Math.max(0, Math.min(end, totalElements) - start),
      hasNext: totalPages > 0 && page < totalPages - 1,
      totalElements,
      totalPages,
    },
  };
};

export const followHandlers = [
  http.get(/\/follow\/[^/]+\/count(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)\/count$/) ?? "";

    if (userId === "999") {
      return HttpResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "유저를 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    // 내 계정은 팔로우/언팔로우 결과가 즉시 반영된 실제 팔로잉 수를 보여줍니다.
    if (userId === CURRENT_USER_ID) {
      return HttpResponse.json({
        followerCount: MOCK_FOLLOWERS.length,
        followingCount: followingList.length,
      });
    }

    // 남의 프로필 카운트: 내가 그 사람을 팔로우 중이면 팔로워 수에 1 만큼 반영합니다.
    return HttpResponse.json({
      followerCount: MOCK_FOLLOWERS.length + (isFollowing(userId) ? 1 : 0),
      followingCount: followingList.length,
    });
  }),

  http.get(endpoint("/follow/following"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 20);

    return HttpResponse.json(createPageResponse(followingList, page, size));
  }),

  http.get(endpoint("/follow/followers"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 20);

    return HttpResponse.json(createPageResponse(MOCK_FOLLOWERS, page, size));
  }),

  http.delete(/\/follow\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)$/) ?? "";

    // FollowService.unfollow: 팔로우 관계가 없으면 거부합니다("888" 은 항상 재현 가능한 고정 트리거).
    if (userId === "888" || !isFollowing(userId)) {
      return HttpResponse.json(
        {
          code: "FOLLOW_NOT_EXISTS",
          message: "팔로우하지 않은 사용자입니다.",
        },
        { status: 409 },
      );
    }

    followingList = followingList.filter((user) => user.userId !== userId);

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(/\/follow\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)$/) ?? "";

    // FollowService.follow: 자기 자신 → 대상 존재 → 중복 팔로우 순으로 검사합니다.
    if (userId === CURRENT_USER_ID) {
      return HttpResponse.json(
        {
          code: "FOLLOW_SELF_NOT_ALLOWED",
          message: "자기 자신을 팔로우할 수 없습니다.",
        },
        { status: 409 },
      );
    }

    if (userId === "999") {
      return HttpResponse.json(
        {
          code: "USER_NOT_FOUND",
          message: "유저를 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    // "666" 은 항상 재현 가능한 고정 트리거, 그 외에는 실제 팔로잉 목록으로 중복 여부를 판단합니다.
    if (userId === "666" || isFollowing(userId)) {
      return HttpResponse.json(
        {
          code: "FOLLOW_ALREADY_EXISTS",
          message: "이미 팔로우한 사용자입니다.",
        },
        { status: 409 },
      );
    }

    // 새로 팔로우한 유저를 목록 맨 앞에 추가해 "최근 팔로우한 순"을 흉내 냅니다.
    followingList = [
      { userId, profileImageUrl: "/p1.png", nickname: `유저_${userId}` },
      ...followingList,
    ];

    return new HttpResponse(null, { status: 204 });
  }),
];
