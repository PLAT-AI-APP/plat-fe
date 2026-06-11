import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";

interface MockFollowUser {
  userId: string;
  profileImage: string | null;
  nickname: string;
  description: string;
}

const createMockUsers = (
  prefix: string,
  startId: number,
  count: number,
): MockFollowUser[] =>
  Array.from({ length: count }, (_, index) => ({
    userId: String(startId + index),
    profileImage: "/p1.png",
    nickname: `${prefix}_${index + 1}`,
    description: `${prefix}_${index + 1}가 만든 캐릭터를 둘러보세요`,
  }));

const MOCK_FOLLOWINGS = createMockUsers("팔로잉", 1000, 24);
const MOCK_FOLLOWERS = createMockUsers("팔로워", 2000, 24);

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
    totalElements,
    totalPages,
    number: page,
    size,
    first: page === 0,
    last: totalPages === 0 || page >= totalPages - 1,
  };
};

export const followHandlers = [
  http.get(/\/follow\/[^/]+\/count(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)\/count$/);

    if (userId === "999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 유저입니다.",
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      data: {
        followerCount: MOCK_FOLLOWERS.length,
        followingCount: MOCK_FOLLOWINGS.length,
      },
    });
  }),

  http.get(endpoint("/follow/following"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 20);

    return HttpResponse.json({
      result: "OK",
      data: createPageResponse(MOCK_FOLLOWINGS, page, size),
    });
  }),

  http.get(endpoint("/follow/followers"), ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || 0);
    const size = Number(url.searchParams.get("size") || 20);

    return HttpResponse.json({
      result: "OK",
      data: createPageResponse(MOCK_FOLLOWERS, page, size),
    });
  }),

  http.delete(/\/follow\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)$/);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "UNAUTHORIZED",
          message: "인증이 필요한 서비스입니다.",
        },
        { status: 401 },
      );
    }

    if (userId === "999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 유저입니다.",
        },
        { status: 404 },
      );
    }

    if (userId === "888") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "팔로우하지 않은 유저입니다.",
        },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      message: "팔로우를 취소했습니다.",
    });
  }),

  http.post(/\/follow\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)$/);
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "UNAUTHORIZED",
          message: "인증이 필요한 서비스입니다.",
        },
        { status: 401 },
      );
    }

    if (userId === "999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "존재하지 않는 유저입니다.",
        },
        { status: 404 },
      );
    }

    if (userId === "777") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "자기 자신을 팔로우할 수 없습니다.",
        },
        { status: 409 },
      );
    }

    if (userId === "666") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "이미 팔로우 중인 유저입니다.",
        },
        { status: 409 },
      );
    }

    return HttpResponse.json({
      result: "OK",
      message: "팔로우했습니다.",
    });
  }),
];
