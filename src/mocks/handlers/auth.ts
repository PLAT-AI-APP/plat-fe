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
  http.post("*/auth/email/signup", async ({ request }) => {
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
  http.post("*/auth/signup", async ({ request }) => {
    const body = await request.json();

    // 명세서에 따른 Request Body 추출
    const { email, nickname, password, passwordCheck, code } = body as any;

    // 1. [400] MethodArgumentNotValidException (필수 필드 및 이메일 형식 누락)
    const fields: Record<string, string> = {};
    if (!email || !email.includes("@"))
      fields.email = "올바른 이메일 형식이 아닙니다.";
    if (!password) fields.password = "비밀번호를 입력해 주세요.";
    if (!code) fields.code = "인증코드를 입력해 주세요.";

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "FIELD_ERROR",
          data: { fields },
        },
        { status: 400 },
      );
    }

    // 2. [400] IllegalArgumentException (비밀번호 형식 및 불일치)
    // 비밀번호 정규식: 특수문자 포함 8자 이상
    const passwordRegex = /^(?=.*[!@#$%^&*()-_=+\[\]{}';:"|,.<>/?]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "비밀번호 형식 불일치 (8자 미만 또는 특수문자 미포함)",
        },
        { status: 400 },
      );
    }

    if (password !== passwordCheck) {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "비밀번호 & 확인 불일치",
        },
        { status: 400 },
      );
    }

    // 3. [404] NoSuchElementException (인증코드 만료 - 테스트용 예시)
    // 특정 코드(예: '000000') 입력 시 만료 에러 발생 시뮬레이션
    if (code === "000000") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "인증코드가 만료되었습니다. 인증코드를 재전송해주세요.",
        },
        { status: 404 },
      );
    }

    // 4. [429] VerifyCodeAttemptExceededException (횟수 초과 - 테스트용 예시)
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

    // 5. 성공 응답
    return HttpResponse.json({
      result: "OK",
      message: "회원가입이 완료되었습니다.",
    });
  }),

  /** 이메일 로그인 요청 */
  http.post("*/auth/login", async ({ request }) => {
    // 1. Request Body 필드명 수정 (email -> username)
    const { username, password } = (await request.json()) as {
      username: string;
      password: string;
    };

    // 2. 로그인 실패 케이스 (InvalidCredentialsException)
    if (username !== "user@example.com" || password !== "password123!") {
      return HttpResponse.json(
        {
          result: "ERROR",
          code: "MESSAGE",
          message: "이메일 또는 비밀번호를 확인해 주세요",
        },
        { status: 401 },
      );
    }

    // 3. 로그인 성공 케이스
    return HttpResponse.json(
      {
        result: "OK", // 명세서 기준 추가
        message: "로그인 성공", // 명세서 기준 추가
        data: {
          accessToken: "mocked-access-token-12345",
        },
      },
      {
        status: 200,
        headers: {
          // 명세서에 명시된 Path=/auth/refresh 적용
          "Set-Cookie":
            "refreshToken=mocked-refresh-token-67890; HttpOnly; Path=/auth/refresh; Max-Age=2592000; SameSite=Lax",
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
