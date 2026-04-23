import { http, HttpResponse } from "msw";

export const followHandlers = [
  /** 유저의 팔로워/팔로잉 수 조회 */
  http.get("*/follow/:userId/count", ({ params }) => {
    const { userId } = params;

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
];
