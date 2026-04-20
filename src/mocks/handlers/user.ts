import { http, HttpResponse } from "msw";

export const userHandlers = [
  /** 내 정보 조회 */
  http.get("*/users/me", async () => {
    return HttpResponse.json({
      result: "OK",
      data: {
        id: 1234567890123456789,
        nickname: "깜귀봉",
        bio: "앞으로가 더 찬란할 크리에이터",
        profileImage: "/images/sample.png",
        birth: "2000-01-15",
        gender: "MALE",
        phone: {
          countryCode: "+82",
          number: "01012345678",
        },
      },
    });
  }),
];
