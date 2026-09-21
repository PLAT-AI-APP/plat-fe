import { http, HttpResponse } from "msw";
import { endpoint } from "../utils";
import type { LoginToastType } from "@/api/auth/emailLogin";

const existingNicknames = ["admin", "test", "plat"];
const firstLoginEmails = new Set(["first@example.com", "taewok0205@gmail.com"]);
const loginToastTestCases: Record<
  string,
  {
    description?: string;
    message: string;
    toastType: LoginToastType;
  }
> = {
  "toast-success@example.com": {
    description: "Small success toast description test.",
    toastType: "success",
    message: "성공 toast 디자인 테스트입니다.",
  },
  "toast-info@example.com": {
    description: "Small info toast description test.",
    toastType: "info",
    message: "정보 toast 디자인 테스트입니다.",
  },
  "toast-warning@example.com": {
    description: "Small warning toast description test.",
    toastType: "warning",
    message: "경고 toast 디자인 테스트입니다.",
  },
  "toast-error@example.com": {
    description: "Small error toast description test.",
    toastType: "error",
    message: "Error toast design test.",
  },
};

/** 백엔드 ErrorResponse(code/message/fields) 형태를 그대로 흉내 냅니다. */
const errorJson = (
  status: number,
  code: string,
  message: string,
  fields?: Record<string, string>,
) =>
  HttpResponse.json({ code, message, ...(fields && { fields }) }, { status });

const NICKNAME_PATTERN = /^[\p{L}\p{N}]+$/u;
const NICKNAME_MAX_LENGTH = 20;
/** AuthRulesProperties.password: 최소 8자 + 특수문자(구두점/기호) 최소 1개 */
const PASSWORD_SPECIAL_PATTERN = /[\p{P}\p{S}]/u;
const PASSWORD_MIN_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** NicknameValidator 와 동일한 순서(필수 → 길이 → 패턴)로 검증합니다. */
const validateNicknameField = (nickname?: string): string | null => {
  if (!nickname || nickname.trim() === "") return "닉네임을 입력해주세요.";
  if (nickname.length > NICKNAME_MAX_LENGTH) return "닉네임은 20자 이하여야 합니다.";
  if (!NICKNAME_PATTERN.test(nickname)) return "닉네임은 1~20자까지 사용할 수 있습니다.";
  return null;
};

/** PasswordValidator 와 동일: 공란 → 길이/특수문자 순으로 검증합니다. */
const validatePasswordField = (password?: string): string | null => {
  if (!password) return "비밀번호를 입력해주세요.";
  if (password.length < PASSWORD_MIN_LENGTH || !PASSWORD_SPECIAL_PATTERN.test(password)) {
    return `특수문자를 포함한 ${PASSWORD_MIN_LENGTH}자 이상이어야 합니다.`;
  }
  return null;
};

const validateEmailField = (email?: string): string | null => {
  if (!email) return "이메일을 입력해주세요.";
  if (!EMAIL_PATTERN.test(email)) return "잘못된 이메일 형식입니다.";
  return null;
};

export const authHandlers = [
  http.post(endpoint("/auth/email/verify"), async ({ request }) => {
    const { email } = (await request.json()) as { email?: string };

    const emailError = validateEmailField(email);
    if (emailError) {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        email: emailError,
      });
    }

    // SendEmailVerificationService: 이메일/기기별 1시간 5회 발송 제한
    if (email === "ratelimit@example.com") {
      return errorJson(
        429,
        "EMAIL_SEND_LIMIT_EXCEEDED",
        "인증 메일 발송 횟수를 초과했습니다. 1시간 후 다시 시도해 주세요.",
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(endpoint("/auth/email/verify/confirm"), async ({ request }) => {
    const { email, code } = (await request.json()) as {
      email?: string;
      code?: string;
    };

    const fields: Record<string, string> = {};
    const emailError = validateEmailField(email);
    if (emailError) fields.email = emailError;
    if (!code) fields.code = "인증번호를 입력해주세요.";

    if (Object.keys(fields).length > 0) {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", fields);
    }

    // EmailVerificationService.verifyCode: 시도 초과 → 만료 → 불일치 순으로 검사
    if (code === "999999") {
      return errorJson(
        429,
        "VERIFY_CODE_ATTEMPT_EXCEEDED",
        "인증코드 인증 5회 초과되었습니다. 인증코드를 재전송해주세요.",
      );
    }
    if (code === "111111") {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "인증코드를 재전송해주세요.",
      });
    }
    if (code === "000000") {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "인증코드가 올바르지 않습니다.",
      });
    }

    // confirmCode 는 코드를 소비하지 않고 유효성만 확인하며, 응답 바디도 없습니다(204).
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(endpoint("/auth/signup"), async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      nickname?: string;
      password?: string;
      passwordCheck?: string;
      code?: string;
    };

    // SignupRequest 빈 검증(이메일/인증코드/비밀번호/비밀번호확인/닉네임)을 한 번에 모읍니다.
    const fields: Record<string, string> = {};
    const emailError = validateEmailField(body.email);
    if (emailError) fields.email = emailError;
    if (!body.code) fields.code = "인증번호를 입력해주세요.";
    const passwordError = validatePasswordField(body.password);
    if (passwordError) fields.password = passwordError;
    if (!body.passwordCheck) {
      fields.passwordCheck = "비밀번호를 입력해주세요.";
    } else if (body.password && body.password !== body.passwordCheck) {
      fields.passwordCheck = "비밀번호가 서로 일치하지 않습니다.";
    }
    const nicknameError = validateNicknameField(body.nickname);
    if (nicknameError) fields.nickname = nicknameError;

    if (Object.keys(fields).length > 0) {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", fields);
    }

    // SignupService.signupEmail: 이메일 중복 → 닉네임 중복 → 인증코드 순으로 검사합니다.
    if (body.email === "already@example.com") {
      return errorJson(409, "EMAIL_UNAVAILABLE", "사용할 수 없는 이메일입니다.");
    }
    if (existingNicknames.includes((body.nickname ?? "").toLowerCase())) {
      return errorJson(409, "NICKNAME_DUPLICATED", "이미 사용 중인 닉네임입니다.");
    }
    if (body.code === "000000") {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "인증코드가 올바르지 않습니다.",
      });
    }
    if (body.code === "111111") {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "인증코드를 재전송해주세요.",
      });
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(endpoint("/auth/login"), async ({ request }) => {
    const { username, password } = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const toastTestCase = username ? loginToastTestCases[username] : undefined;

    // 로그인 화면에서 토스트 디자인을 확인할 때 사용하는 검수 전용 케이스입니다(백엔드에는 없는 목업 전용 트리거).
    if (username === "alert@example.com") {
      return errorJson(
        429,
        "TOO_MANY_REQUESTS",
        "요청이 너무 많아요. 잠시 후 다시 시도해 주세요.",
      );
    }

    // JsonAuthenticationFilter + LoginFailureHandler: 필드 누락/계정 없음/비밀번호 불일치를 구분하지 않고
    // 항상 같은 401 LOGIN_FAILED 를 반환합니다(계정 열거 방지).
    if (
      !username ||
      !password ||
      username === "fail@example.com" ||
      password === "wrong-password"
    ) {
      return errorJson(401, "LOGIN_FAILED", "아이디 또는 비밀번호가 틀렸습니다.");
    }

    return HttpResponse.json(
      {
        accessToken: "mock-access-token",
        isNew: firstLoginEmails.has(username),
        // toast 디자인 확인용 MSW 계정에서만 내려주는 검수 전용 필드입니다.
        ...(toastTestCase && {
          toastDescription: toastTestCase.description,
          toastMessage: toastTestCase.message,
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
    return new HttpResponse(null, {
      status: 204,
      headers: {
        "Set-Cookie": "refreshToken=; Path=/; Max-Age=0; SameSite=Lax",
      },
    });
  }),

  http.post(endpoint("/auth/refresh"), async ({ cookies }) => {
    // RefreshController: 쿠키가 없거나 무효/만료면 항상 같은 401 을 반환합니다.
    if (!cookies.refreshToken || cookies.refreshToken === "invalid_token") {
      return errorJson(
        401,
        "REFRESH_TOKEN_INVALID",
        "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
      );
    }

    return HttpResponse.json(
      { accessToken: "mock-refreshed-access-token" },
      {
        status: 200,
        headers: {
          "Set-Cookie":
            "refreshToken=mock-refresh-token; Path=/; Max-Age=2592000; SameSite=Lax",
        },
      },
    );
  }),

  http.post(endpoint("/auth/social/token"), async ({ request }) => {
    const { code } = (await request.json()) as { code?: string };

    if (!code) {
      // SocialTokenRequest 의 @NotBlank 커스텀 메시지 키(auth.social.error.codeInvalid)가
      // messages_ko.properties 에 없어 백엔드가 키 문자열을 그대로 message 로 내려줍니다.
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "auth.social.error.codeInvalid",
      });
    }

    // SocialTokenService.exchange: 저장된 코드가 없거나 이미 소비됐으면 항상 만료로 안내합니다.
    if (code === "fail") {
      return errorJson(
        401,
        "SOCIAL_CODE_EXPIRED",
        "소셜 로그인이 만료되었습니다. 다시 시도해주세요.",
      );
    }

    return HttpResponse.json({
      accessToken: "mock-social-access-token",
      isNew: code === "new",
    });
  }),

  http.post(endpoint("/auth/password/reset"), async ({ request }) => {
    const { email, code, password, passwordCheck } = (await request.json()) as {
      email?: string;
      code?: string;
      password?: string;
      passwordCheck?: string;
    };

    const fields: Record<string, string> = {};
    const emailError = validateEmailField(email);
    if (emailError) fields.email = emailError;
    if (!code) fields.code = "인증번호를 입력해주세요.";
    const passwordError = validatePasswordField(password);
    if (passwordError) fields.password = passwordError;
    if (!passwordCheck) {
      fields.passwordCheck = "비밀번호를 입력해주세요.";
    } else if (password && password !== passwordCheck) {
      fields.passwordCheck = "비밀번호가 서로 일치하지 않습니다.";
    }

    if (Object.keys(fields).length > 0) {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", fields);
    }

    // ResetPasswordService: 인증코드 검사 → 가입 이메일 존재 검사 순으로 진행합니다.
    if (code === "000000") {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "인증코드가 올바르지 않습니다.",
      });
    }
    if (code === "111111") {
      return errorJson(400, "INVALID_INPUT", "요청 값이 올바르지 않습니다.", {
        code: "인증코드를 재전송해주세요.",
      });
    }
    if (email === "notfound@example.com") {
      return errorJson(404, "USER_NOT_FOUND", "유저를 찾을 수 없습니다.");
    }

    return new HttpResponse(null, { status: 204 });
  }),

  http.get(endpoint("/auth/nickname"), ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname") ?? "";

    // AuthController.checkNickname 은 형식 검증 없이 중복 여부만 확인합니다.
    return HttpResponse.json({
      available: !existingNicknames.includes(nickname.toLowerCase()),
    });
  }),
];
