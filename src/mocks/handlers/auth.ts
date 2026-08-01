import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { LoginToastSize, LoginToastType } from "@/api/auth/emailLogin";

const existingNicknames = ["admin", "test", "plat"];
const verifiedEmails = new Set<string>();
const firstLoginEmails = new Set(["first@example.com", "taewok0205@gmail.com"]);
const loginToastTestCases: Record<
  string,
  {
    description?: string;
    message: string;
    toastSize?: LoginToastSize;
    toastType: LoginToastType;
  }
> = {
  "toast-success@example.com": {
    description: "Medium success toast description test.",
    toastType: "success",
    message: "성공 toast 디자인 테스트입니다.",
  },
  "toast-info@example.com": {
    description: "Medium info toast description test.",
    toastType: "info",
    message: "정보 toast 디자인 테스트입니다.",
  },
  "toast-warning@example.com": {
    description: "Medium warning toast description test.",
    toastType: "warning",
    message: "경고 toast 디자인 테스트입니다.",
  },
  "toast-error@example.com": {
    description: "Medium error toast description test.",
    toastType: "error",
    message: "Error toast design test.",
  },
  "toast-success-m@example.com": {
    description: "Medium success toast description test.",
    toastSize: "m",
    toastType: "success",
    message: "Medium success toast test.",
  },
  "toast-info-m@example.com": {
    description: "Medium info toast description test.",
    toastSize: "m",
    toastType: "info",
    message: "Medium info toast test.",
  },
  "toast-warning-m@example.com": {
    description: "Medium warning toast description test.",
    toastSize: "m",
    toastType: "warning",
    message: "Medium warning toast test.",
  },
  "toast-error-m@example.com": {
    description: "Medium error toast description test.",
    toastSize: "m",
    toastType: "error",
    message: "Medium error toast test.",
  },
  "toast-success-s@example.com": {
    toastSize: "s",
    toastType: "success",
    message: "Small success toast test.",
  },
  "toast-info-s@example.com": {
    toastSize: "s",
    toastType: "info",
    message: "Small info toast test.",
  },
  "toast-warning-s@example.com": {
    toastSize: "s",
    toastType: "warning",
    message: "Small warning toast test.",
  },
  "toast-error-s@example.com": {
    toastSize: "s",
    toastType: "error",
    message: "Small error toast test.",
  },
};

const ok = <T>(data?: T, _message?: string) => {
  void _message;

  if (data === undefined || data === null) {
    return new HttpResponse(null, { status: 204 });
  }

  return HttpResponse.json(data);
};

type LegacyMockErrorCode = "MESSAGE" | "ALERT" | "FIELD_ERROR";

/** 예전 mock 코드명을 현재 백엔드 오류 코드 형식으로 변환합니다. */
const normalizeMockErrorCode = (
  code: LegacyMockErrorCode,
  status: number,
) => {
  if (code === "FIELD_ERROR") return "INVALID_INPUT";
  if (code === "ALERT") return "TOO_MANY_REQUESTS";
  if (status === 401) return "LOGIN_FAILED";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";

  return "INVALID_REQUEST";
};

const error = (
  status: number,
  code: LegacyMockErrorCode,
  message: string,
  fields?: Record<string, string>,
) =>
  HttpResponse.json(
    {
      code: normalizeMockErrorCode(code, status),
      message,
      ...(fields && { fields }),
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
      return error(400, "MESSAGE", "이미 가입한 이메일입니다.");
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

    // 기본 토스트 확인용 ALERT 케이스입니다.
    if (code === "999999") {
      return error(
        429,
        "ALERT",
        "인증 시도 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.",
      );
    }

    verifiedEmails.add(email);

    return ok(
      { emailVerifyToken: `mock-email-token-${code}` },
      "이메일 인증이 완료되었어요.",
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
      return error(400, "MESSAGE", "이미 가입한 이메일입니다.");
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
    const toastTestCase = username ? loginToastTestCases[username] : undefined;

    if (!username || !password) {
      return error(400, "FIELD_ERROR", "로그인 정보를 입력해 주세요.", {
        ...(!username && { email: "이메일을 입력해 주세요." }),
        ...(!password && { pw: "비밀번호를 입력해 주세요." }),
      });
    }

    if (username === "fail@example.com" || password === "wrong-password") {
      return error(
        401,
        "MESSAGE",
        "이메일 또는 비밀번호를 다시 확인해 주세요.",
      );
    }

    // 로그인 화면에서 토스트 디자인을 확인할 때 사용하는 케이스입니다.
    if (username === "alert@example.com") {
      return error(
        429,
        "ALERT",
        "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.",
      );
    }

    return HttpResponse.json(
      {
        accessToken: "mock-access-token",
        isFirstLogin: firstLoginEmails.has(username),
        // toast 디자인 확인용 MSW 계정에서만 내려주는 테스트 전용 필드입니다.
        ...(toastTestCase && {
          toastDescription: toastTestCase.description,
          toastMessage: toastTestCase.message,
          toastSize: toastTestCase.toastSize,
          toastType: toastTestCase.toastType,
        }),
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
