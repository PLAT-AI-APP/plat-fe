import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";

const MOCK_FOLLOWINGS = Array.from({ length: 100 }, (_, i) => ({
  userId: 100 + i,
  profileImage: `/public/p1.png`,
  nickname: `유저_${i + 1}`,
}));

const MOCK_FOLLOWERS = Array.from({ length: 100 }, (_, i) => ({
  userId: i + 1,
  profileImage: "/public/p1.png", // null 가능성 반영
  nickname: `팔로워_철수_${i + 1}`,
}));

export const followHandlers = [
  /** 유저의 팔로워/팔로잉 수 조회 */
  http.get(/\/follow\/[^/]+\/count(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)\/count$/);

    // 유저가 없을 경우 (404)
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

    // 팔로워/팔로잉 숫자 정보만 반환
    return HttpResponse.json({
      result: "OK",
      data: {
        followerCount: 150, // 예시 데이터
        followingCount: 30, // 문서에 있던 totalElements 예시값 적용
      },
    });
  }),

  /** 팔로잉 목록 조회 핸들러 */
  http.get(endpoint("/follow/following"), ({ request }) => {
    const url = new URL(request.url);

    // 1. Query String 추출 (userId는 더 이상 추출하지 않음)
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "20", 10);

    // 2. 페이지네이션 계산 로직
    const totalElements = MOCK_FOLLOWINGS.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = MOCK_FOLLOWINGS.slice(start, end);

    // 3. 성공 응답
    return HttpResponse.json({
      result: "OK",
      data: {
        content: content,
        totalElements: totalElements,
        totalPages: totalPages,
        number: page,
        size: size,
        first: page === 0,
        last: page >= totalPages - 1,
      },
    });
  }),

  /** 팔로워 목록 조회 핸들러 */
  http.get(endpoint("/follow/followers"), ({ request }) => {
    const url = new URL(request.url);

    // 1. Query String 파싱
    const page = parseInt(url.searchParams.get("page") || "0", 10);
    const size = parseInt(url.searchParams.get("size") || "20", 10);

    // 2. 페이지네이션 로직
    const totalElements = MOCK_FOLLOWERS.length;
    const totalPages = Math.ceil(totalElements / size);
    const start = page * size;
    const end = start + size;
    const content = MOCK_FOLLOWERS.slice(start, end);

    // 3. Response Body
    return HttpResponse.json({
      result: "OK",
      data: {
        content: content,
        totalElements: totalElements,
        totalPages: totalPages,
        number: page,
        size: size,
        first: page === 0,
        last: page >= totalPages - 1,
      },
    });
  }),

  /** 특정 유저 언팔로우 API */
  http.delete(/\/follow\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)$/);
    const authHeader = request.headers.get("Authorization");

    // 1. 인증 체크 (Bearer 토큰 유무 확인)
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

    // 2. Exception: 존재하지 않는 유저 (404 Not Found)
    // 테스트 시 ID를 999로 보내면 이 에러가 발생합니다.
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

    // 3. Exception: 팔로우하지 않은 유저를 언팔로우하려는 경우 (409 Conflict)
    // 테스트 시 ID를 888로 보내면 이 에러가 발생하도록 설정했습니다.
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

    // 4. 성공 응답 (200 OK)
    return HttpResponse.json({
      result: "OK",
      message: "팔로우를 취소했습니다.",
    });
  }),

  /** 특정 유저 팔로우 API */
  http.post(/\/follow\/[^/]+(?:\?.*)?$/, ({ request }) => {
    const userId = pathValue(request.url, /\/follow\/([^/]+)$/);
    const authHeader = request.headers.get("Authorization");

    // 1. 인증 체크 (Bearer 토큰 유무 확인)
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

    // 2. Exception: 존재하지 않는 유저 (404 Not Found)
    // 테스트 시 ID를 999로 보내면 발생
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

    // 3. Exception: 자기 자신을 팔로우하려는 경우 (409 Conflict)
    // 테스트 시 ID를 777로 보내면 발생하도록 시뮬레이션
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

    // 4. Exception: 이미 팔로우 중인 유저 (409 Conflict)
    // 테스트 시 ID를 666으로 보내면 발생하도록 시뮬레이션
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

    // 5. 성공 응답
    return HttpResponse.json({
      result: "OK",
      message: "팔로우했습니다.",
    });
  }),
];
