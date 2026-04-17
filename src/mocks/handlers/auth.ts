import { http, HttpResponse } from "msw";

// 가상의 기존 등록된 닉네임 리스트
const existingNicknames = ["김철수", "마법사", "태욱", "admin"];

export const authHandlers = [
  /** 이메일 인증번호 발송 */
  http.post("*/auth/email/verify", async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    // 에러 시뮬레이션용 이메일
    if (email === "fail@test.com") {
      return HttpResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 400 },
      );
    }

    // 성공 응답
    return HttpResponse.json({
      result: "OK",
      message: "인증번호가 발송되었습니다.",
    });
  }),

  /** 이메일 인증번호 확인 */
  http.post("*/auth/email/verify/confirm", async ({ request }) => {
    const { email, code } = (await request.json()) as {
      email: string;
      code: string;
    };
    console.log("MSW가 낚아챈 코드:", code); // 👈 로그 추가해서 확인

    // 2. [400] 잘못된 인증 코드
    if (code === "000000") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "인증코드가 올바르지 않습니다.",
        },
        { status: 400 },
      );
    }

    // 3. [404] 코드 만료
    if (code === "111111") {
      console.log("MSW Intercepted: Returning 404 error for code 111111");
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "인증코드가 만료되었습니다. 인증코드를 재전송해주세요.",
        },
        { status: 404 },
      );
    }

    // 4. [429] 5회 초과 시도
    if (code === "999999") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "ALERT",
          message:
            "인증코드 인증 5회 초과되었습니다. 인증코드를 재전송해주세요.",
        },
        { status: 429 },
      );
    }

    // 5. 성공 응답 (기본)
    if (code === "123456") {
      return HttpResponse.json({
        result: "OK",
        message: "인증에 성공하였습니다.",
        data: {
          emailVerifyToken: "evt_test_token_123456",
        },
      });
    }
  }),

  /** 이메일 회원가입 요청 */
  http.post("*/auth/email/register", async ({ request }) => {
    const { email, emailVerifyToken, password, passwordCheck } =
      (await request.json()) as {
        email: string;
        password: string;
        passwordCheck: string;
        emailVerifyToken: string;
      };

    // 성공 응답
    return HttpResponse.json({
      result: "OK",
      message: "이메일 회원가입 요청이 완료되었습니다.",
      data: {
        signupToken: "rtXXXXXXXXXXXXXXXXXXXXXXXX",
      },
    });
  }),

  /** 회원가입 요청 */
  http.post("*/auth/register", async ({ request }) => {
    const { signupToken, nickname, birthDate, gender } =
      (await request.json()) as {
        signupToken: string;
        nickname: string;
        birthDate: string;
        gender: string;
      };

    // 1. 만 14세 미만 계산 로직
    const checkIsUnder14 = (birthDateStr: string) => {
      const today = new Date();
      const birth = new Date(birthDateStr);

      // 기본 연도 차이 계산
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      // 생일이 아직 안 지났으면 한 살 더 빼기 (만 나이 계산)
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }
      return age < 14;
    };

    // 2. [400] 나이 제한 에러 처리
    if (birthDate && checkIsUnder14(birthDate)) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          data: {
            fields: {
              birthDate: "이용 불가 연령입니다.",
            },
          },
        },
        { status: 400 },
      );
    }

    // 성공 응답
    return HttpResponse.json({
      result: "OK",
      message: "회원가입이 완료되었습니다.",
    });
  }),

  /** 이메일 로그인 요청 */
  http.post("*/auth/email/login", async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string;
      password: string;
    };

    // 로그인 실패 케이스
    if (email !== "taewok0205@gmail.com" || password !== "test1234") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "이메일 또는 비밀번호를 확인해 주세요",
        },
        { status: 401 },
      );
    }

    // 로그인 성공 케이스
    return HttpResponse.json(
      {
        // AccessToken은 메모리 보관을 위해 JSON Body로 전달합니다.
        data: {
          accessToken: "mocked-access-token-12345",
        },
      },
      {
        status: 200,
        headers: {
          // RefreshToken만 HttpOnly 쿠키로 설정합니다.
          // Path를 /auth/refresh로 제한하면 보안이 더 강화됩니다.
          "Set-Cookie":
            "refreshToken=mocked-refresh-token-67890; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax",
        },
      },
    );
  }),

  /** 로그아웃 */
  http.post("*/auth/logout", async () => {
    return HttpResponse.json({
      result: "OK",
      message: "로그아웃되었습니다.",
    });
  }),

  /** 닉네임 중복 조회 */
  http.get("*/auth/nickname", ({ request }) => {
    // URL에서 쿼리 파라미터(nickname) 추출
    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname");

    // 닉네임이 전달되지 않았을 경우 처리
    if (!nickname) {
      return new HttpResponse(
        JSON.stringify({
          result: "FAIL",
          message: "닉네임을 입력해주세요.",
        }),
        { status: 400 },
      );
    }

    // 중복 여부 확인 (이미 존재하면 available: false)
    const isAvailable = !existingNicknames.includes(nickname);

    return HttpResponse.json({
      result: "OK",
      data: {
        available: isAvailable,
      },
    });
  }),
];
