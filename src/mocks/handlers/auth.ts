import { delay, http, HttpResponse } from "msw";

// 가상의 기존 등록된 닉네임 리스트
const existingNicknames = ["김철수", "마법사", "태욱", "admin"];
// 임시 토큰 생성 함수 (실제 구현 시에는 더 복잡한 문자열 사용 가능)
const generateToken = (type: "access" | "refresh") =>
  `new_${type}_token_${Math.random().toString(36).substring(7)}`;

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
          // emailVerifyToken: "evt_test_token_123456",
        },
      });
    }
  }),

  /** 이메일 회원가입 요청 핸들러 */
  // http.post("*/auth/signup", async ({ request }) => {
  //   const { email, nickname, password, passwordCheck, code } =
  //     (await request.json()) as any;

  //   // 1. MethodArgumentNotValidException (Field Error) 시뮬레이션
  //   // 예: 이메일 형식이 아니거나 필수 값이 누락된 경우
  //   if (!email || !password) {
  //     return HttpResponse.json(
  //       {
  //         result: "ERROR",
  //         code: "FIELD_ERROR",
  //         data: {
  //           fields: {
  //             email: !email
  //               ? "이메일을 입력해 주세요."
  //               : "잘못된 이메일 형식에요",
  //             password: !password ? "비밀번호를 입력해 주세요." : "",
  //           },
  //         },
  //       },
  //       { status: 400 },
  //     );
  //   }

  //   // 2. IllegalArgumentException 시뮬레이션
  //   // 비밀번호 형식 불일치 (특수문자 포함 8자 이상 정규식)
  //   const passwordRegex = /^(?=.*[!@#$%^&*()-_=+\[\]{}';:"|,.<>\/?]).{8,}$/;

  //   if (!passwordRegex.test(password)) {
  //     return HttpResponse.json(
  //       {
  //         result: "ERROR",
  //         code: "MESSAGE",
  //         message: "비밀번호 형식 불일치 (8자 이상, 특수문자 포함)",
  //       },
  //       { status: 400 },
  //     );
  //   }

  //   // 비밀번호 & 확인 불일치
  //   if (password !== passwordCheck) {
  //     return HttpResponse.json(
  //       {
  //         result: "ERROR",
  //         code: "MESSAGE",
  //         message: "비밀번호가 일치하지 않습니다.",
  //       },
  //       { status: 400 },
  //     );
  //   }

  //   // 이미 가입된 이메일 예시 (테스트용)
  //   if (email === "already@example.com") {
  //     return HttpResponse.json(
  //       {
  //         result: "ERROR",
  //         code: "MESSAGE",
  //         message: "이미 가입된 이메일입니다.",
  //       },
  //       { status: 400 },
  //     );
  //   }

  //   // 3. NoSuchElementException (404) - 인증코드 만료
  //   if (code === "000000") {
  //     return HttpResponse.json(
  //       {
  //         result: "ERROR",
  //         code: "MESSAGE",
  //         message: "인증코드가 만료되었습니다. 인증코드를 재전송해주세요.",
  //       },
  //       { status: 404 },
  //     );
  //   }

  //   // 4. VerifyCodeAttemptExceededException (429) - 5회 초과
  //   if (code === "999999") {
  //     return HttpResponse.json(
  //       {
  //         result: "ERROR",
  //         code: "ALERT",
  //         message:
  //           "인증코드 인증 5회 초과되었습니다. 인증코드를 재전송해주세요.",
  //       },
  //       { status: 429 },
  //     );
  //   }

  //   // 5. 성공 응답 (OK)
  //   return HttpResponse.json(
  //     {
  //       result: "OK",
  //       message: "회원가입이 완료되었습니다.",
  //     },
  //     { status: 200 },
  //   );
  // }),

  /** 회원가입 요청 */
  http.post("*/auth/signup", async ({ request }) => {
    const body = await request.json();

    // 명세서에 따른 Request Body 추출
    const { email, nickname, password, passwordCheck, code } = body as any;

    // 1. [400] MethodArgumentNotValidException (필수 필드 및 이메일 형식 누락)
    const fields: Record<string, string> = {};
    if (!email || !email.includes("@"))
      fields.email = "잘못된 이메일 형식에요";
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
    if (username !== "taewok0205@gmail.com" || password !== "test1234") {
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
        result: "OK",
        message: "로그인 성공",
        data: {
          accessToken: "mocked-access-token-12345",
        },
      },
      {
        status: 200,
        headers: {
          // Path를 / 로 변경하여 모든 경로에서 보이게 함
          // 테스트를 위해 HttpOnly를 제거하면 document.cookie에서도 보입니다.
          "Set-Cookie":
            "refreshToken=mocked-refresh-token-67890; Path=/; Max-Age=2592000; SameSite=Lax",
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

  /** jwt 토큰 갱신 */
  http.post("*/auth/refresh", async ({ request, cookies }) => {
    const clientType = request.headers.get("X-Client-Type");

    await delay(500); // 네트워크 지연 시뮬레이션

    // --- WEB 클라이언트 로직 (Cookie 기반) ---
    if (clientType === "web") {
      const refreshToken = cookies.refreshToken; // 쿠키 키값 소문자 확인 필요

      // 쿠키에 토큰이 없거나 무효한 경우
      if (!refreshToken || refreshToken === "invalid_token") {
        return HttpResponse.json(
          {
            result: "ERROR",
            code: "MESSAGE",
            message: "로그인 세션이 만료되었습니다.",
          },
          { status: 401 },
        );
      }

      const newAccessToken = "at_" + Math.random().toString(36).substring(2);
      const newRefreshToken = "rt_" + Math.random().toString(36).substring(2);

      return HttpResponse.json(
        {
          result: "OK",
          message: "토큰이 갱신되었습니다.",
          data: {
            accessToken: newAccessToken, // Body에 담아서 내려줌
          },
        },
        {
          status: 200,
          headers: {
            // AccessToken은 Body로 가므로 쿠키에서는 제거, RefreshToken만 구워줌
            "Set-Cookie": `refreshToken=${newRefreshToken}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax`,
          },
        },
      );
    }

    // --- APP 클라이언트 로직 (Body 기반) ---
    if (clientType === "app") {
      const body = (await request.json()) as { refreshToken?: string };
      const refreshToken = body.refreshToken;

      if (!refreshToken || refreshToken === "invalid_token") {
        return HttpResponse.json(
          {
            result: "ERROR",
            code: "MESSAGE",
            message: "로그인 세션이 만료되었습니다.",
          },
          { status: 401 },
        );
      }

      return HttpResponse.json(
        {
          result: "OK",
          data: {
            accessToken: "at_" + Math.random().toString(36).substring(2),
            refreshToken: "rt_" + Math.random().toString(36).substring(2), // RTR 적용
          },
        },
        { status: 200 },
      );
    }
  }),
];
