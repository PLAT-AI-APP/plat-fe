import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";

const existingNicknames = ["admin", "test", "plat"];
const verifiedEmails = new Set<string>();

const ok = <T>(data?: T, message?: string) =>
  HttpResponse.json({
    result: "OK",
    ...(message && { message }),
    ...(data !== undefined && { data }),
  });

const error = (
  status: number,
  code: "MESSAGE" | "ALERT" | "FIELD_ERROR",
  message: string,
  fields?: Record<string, string>,
) =>
  HttpResponse.json(
    {
      result: "ERROR",
      code,
      message,
      ...(fields && { data: { fields } }),
    },
    { status },
  );

export const authHandlers = [
  http.post(endpoint("/auth/email/verify"), async ({ request }) => {
    const { email } = (await request.json()) as { email?: string };

    if (!email) {
      return error(400, "FIELD_ERROR", "이메일을 입력해 주세요.", {
        email: "이메일을 입력해 주세요.",
      });
    }

    if (email === "already@example.com") {
      return error(400, "MESSAGE", "이미 가입된 이메일입니다.");
    }

    return ok(null, "인증번호가 발송되었습니다.");
  }),

  http.post(endpoint("/auth/email/verify/confirm"), async ({ request }) => {
    const { email, code } = (await request.json()) as {
      email?: string;
      code?: string;
    };

    if (!email || !code) {
      return error(400, "FIELD_ERROR", "인증 정보를 확인해 주세요.", {
        ...(!email && { email: "이메일을 입력해 주세요." }),
        ...(!code && { code: "인증코드를 입력해 주세요." }),
      });
    }

    if (code === "000000") {
      return error(400, "MESSAGE", "인증코드가 올바르지 않습니다.");
    }

    if (code === "111111") {
      return error(404, "MESSAGE", "인증코드가 만료되었습니다.");
    }

    if (code === "999999") {
      return error(
        429,
        "ALERT",
        "인증 시도 횟수를 초과했습니다. 인증코드를 재전송해 주세요.",
      );
    }

    verifiedEmails.add(email);

    return ok(
      { emailVerifyToken: `mock-email-token-${code}` },
      "이메일 인증이 완료되었어요",
    );
  }),

  http.post(endpoint("/auth/signup"), async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      nickname?: string;
      password?: string;
      passwordCheck?: string;
      code?: string;
    };

    const fields: Record<string, string> = {};
    if (!body.email) fields.email = "이메일을 입력해 주세요.";
    if (!body.nickname) fields.nickname = "닉네임을 입력해 주세요.";
    if (!body.password) fields.password = "비밀번호를 입력해 주세요.";
    if (!body.passwordCheck) {
      fields.passwordCheck = "비밀번호 확인을 입력해 주세요.";
    }
    if (!body.code) fields.code = "인증코드를 입력해 주세요.";

    if (Object.keys(fields).length > 0) {
      return error(400, "FIELD_ERROR", "입력값을 확인해 주세요.", fields);
    }

    const email = body.email;
    const password = body.password;
    const passwordCheck = body.passwordCheck;

    if (!email || !password || !passwordCheck) {
      return error(400, "FIELD_ERROR", "입력값을 확인해 주세요.", fields);
    }

    if (password !== passwordCheck) {
      return error(400, "FIELD_ERROR", "비밀번호가 일치하지 않습니다.", {
        passwordCheck: "비밀번호가 일치하지 않습니다.",
      });
    }

    if (email === "already@example.com") {
      return error(400, "MESSAGE", "이미 가입된 이메일입니다.");
    }

    if (!verifiedEmails.has(email)) {
      return error(400, "MESSAGE", "이메일 인증을 완료해 주세요.");
    }

    return ok(null, "회원가입이 완료되었습니다.");
  }),

  http.post(endpoint("/auth/login"), async ({ request }) => {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      return error(400, "FIELD_ERROR", "로그인 정보를 입력해 주세요.", {
        ...(!username && { email: "이메일을 입력해 주세요." }),
        ...(!password && { pw: "비밀번호를 입력해 주세요." }),
      });
    }

    if (username === "fail@example.com" || password === "wrong-password") {
      return error(401, "MESSAGE", "이메일 또는 비밀번호를 확인해 주세요.");
    }

    return HttpResponse.json(
      {
        result: "OK",
        message: "로그인되었습니다.",
        data: {
          accessToken: "mock-access-token",
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "refreshToken=mock-refresh-token; Path=/; Max-Age=2592000; SameSite=Lax",
        },
      },
    );
  }),

  http.post(endpoint("/auth/logout"), async () => {
    return ok(null, "로그아웃되었습니다.");
  }),

  http.post(endpoint("/auth/refresh"), async ({ cookies }) => {
    if (cookies.refreshToken === "invalid_token") {
      return error(401, "MESSAGE", "로그인 세션이 만료되었습니다.");
    }

    return ok(
      { accessToken: "mock-refreshed-access-token" },
      "토큰이 갱신되었습니다.",
    );
  }),

  http.post(endpoint("/auth/social/token"), async ({ request }) => {
    const { code } = (await request.json()) as { code?: string };

    if (!code || code === "fail") {
      return error(401, "MESSAGE", "소셜 로그인에 실패했습니다.");
    }

    return ok({ accessToken: "mock-social-access-token" }, "로그인되었습니다.");
  }),

  http.post(endpoint("/auth/password/reset"), async ({ request }) => {
    const { email, code, password, passwordCheck } = (await request.json()) as {
      email?: string;
      code?: string;
      password?: string;
      passwordCheck?: string;
    };

    const fields: Record<string, string> = {};
    if (!email) fields.email = "이메일을 입력해 주세요.";
    if (!code) fields.code = "인증코드를 입력해 주세요.";
    if (!password) fields.password = "새 비밀번호를 입력해 주세요.";
    if (!passwordCheck) {
      fields.passwordCheck = "새 비밀번호 확인을 입력해 주세요.";
    }

    if (Object.keys(fields).length > 0) {
      return error(400, "FIELD_ERROR", "입력값을 확인해 주세요.", fields);
    }

    if (password !== passwordCheck) {
      return error(400, "FIELD_ERROR", "비밀번호가 일치하지 않습니다.", {
        passwordCheck: "비밀번호가 일치하지 않습니다.",
      });
    }

    return ok(null, "비밀번호가 재설정되었습니다.");
  }),

  http.get(endpoint("/auth/nickname"), ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname") ?? "";

    if (!nickname) {
      return error(400, "FIELD_ERROR", "닉네임을 입력해 주세요.", {
        nickname: "닉네임을 입력해 주세요.",
      });
    }

    return ok({
      available: !existingNicknames.includes(nickname.toLowerCase()),
    });
  }),
];
