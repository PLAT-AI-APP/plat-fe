import { http, HttpResponse } from "msw";
import { endpoint, pathValue } from "../utils";

/**
 * 본인인증·성인인증·19 토글 목업. 실제 서버처럼 상태가 바뀌면 인증 클레임(idu·adu·adm)이 실린 새 access 토큰을 준다.
 * 화면은 토큰 클레임으로 성인 노출을 판단하므로, 목업 토큰도 JWT 모양으로 만든다(서명은 의미 없다).
 */

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;
const ADULT_AGE = 19;

interface MockVerificationState {
  identityVerifiedAt: string | null;
  identityVerifiedUntil: string | null;
  adultVerifiedAt: string | null;
  adultVerifiedUntil: string | null;
  adultContentEnabled: boolean;
  birthLocked: boolean;
}

let state: MockVerificationState = {
  identityVerifiedAt: null,
  identityVerifiedUntil: null,
  adultVerifiedAt: null,
  adultVerifiedUntil: null,
  adultContentEnabled: false,
  birthLocked: false,
};

/** GET /users/me 에 덧붙일 인증 필드. */
export const mockVerificationFields = () => ({ ...state });

interface PendingVerification {
  completed: { birth: string } | null;
  expiresAt: number;
}

const pending = new Map<string, PendingVerification>();

const toBase64Url = (value: string) =>
  btoa(unescape(encodeURIComponent(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

const toEpochSeconds = (iso: string | null) =>
  iso ? Math.floor(new Date(iso).getTime() / 1000) : undefined;

const issueMockAccessToken = () => {
  const header = toBase64Url(JSON.stringify({ alg: "none", typ: "JWT" }));
  const payload = toBase64Url(
    JSON.stringify({
      uid: "1234567890123456789",
      use: "access",
      idu: toEpochSeconds(state.identityVerifiedUntil),
      adu: toEpochSeconds(state.adultVerifiedUntil),
      adm: state.adultContentEnabled,
    }),
  );
  return `${header}.${payload}.mock-signature`;
};

const ageOf = (birth: string, now = new Date()) => {
  const [year, month, day] = birth.split("-").map(Number);
  let age = now.getFullYear() - year;
  const beforeBirthday =
    now.getMonth() + 1 < month || (now.getMonth() + 1 === month && now.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age;
};

const errorResponse = (status: number, code: string, message: string) =>
  HttpResponse.json({ code, message, fields: {} }, { status });

export const verificationHandlers = [
  http.post(endpoint("/verifications/identity"), () => {
    const verificationId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const expiresAt = Date.now() + 10 * 60 * 1000;
    pending.set(verificationId, { completed: null, expiresAt });

    return HttpResponse.json(
      { verificationId, provider: "MOCK", expiresAt: new Date(expiresAt).toISOString() },
      { status: 201 },
    );
  }),

  http.post(/\/dev\/identity-verifications\/([^/]+)\/complete(?:\?.*)?$/, async ({ request }) => {
    const verificationId = pathValue(
      request.url,
      /\/dev\/identity-verifications\/([^/]+)\/complete/,
    );
    const entry = verificationId ? pending.get(verificationId) : undefined;
    if (!entry || entry.expiresAt < Date.now()) {
      return errorResponse(404, "IDENTITY_VERIFICATION_NOT_FOUND", "인증 건을 찾을 수 없습니다.");
    }
    const body = (await request.json()) as { birth: string };
    entry.completed = { birth: body.birth };

    return new HttpResponse(null, { status: 204 });
  }),

  http.post(/\/verifications\/identity\/([^/]+)\/confirm(?:\?.*)?$/, ({ request }) => {
    const verificationId = pathValue(
      request.url,
      /\/verifications\/identity\/([^/]+)\/confirm/,
    );
    const entry = verificationId ? pending.get(verificationId) : undefined;
    if (!verificationId || !entry || entry.expiresAt < Date.now()) {
      return errorResponse(404, "IDENTITY_VERIFICATION_NOT_FOUND", "인증 건을 찾을 수 없습니다.");
    }
    if (!entry.completed) {
      return errorResponse(409, "IDENTITY_VERIFICATION_INCOMPLETE", "아직 인증이 끝나지 않았습니다.");
    }
    pending.delete(verificationId);

    const now = new Date();
    const until = new Date(now.getTime() + YEAR_MS).toISOString();
    const adult = ageOf(entry.completed.birth, now) >= ADULT_AGE;
    state = {
      ...state,
      identityVerifiedAt: now.toISOString(),
      identityVerifiedUntil: until,
      ...(adult ? { adultVerifiedAt: now.toISOString(), adultVerifiedUntil: until } : {}),
      birthLocked: true,
    };

    return HttpResponse.json({
      accessToken: issueMockAccessToken(),
      identityVerifiedUntil: until,
      adult,
      adultVerifiedUntil: adult ? until : null,
    });
  }),

  http.patch(endpoint("/users/me/adult-content"), async ({ request }) => {
    const { enabled } = (await request.json()) as { enabled: boolean };
    const adultValid =
      state.adultVerifiedUntil !== null &&
      new Date(state.adultVerifiedUntil).getTime() > Date.now();
    if (enabled && !adultValid) {
      return errorResponse(403, "ADULT_VERIFICATION_REQUIRED", "성인인증이 필요합니다.");
    }
    state = { ...state, adultContentEnabled: enabled };

    return HttpResponse.json({
      accessToken: issueMockAccessToken(),
      adultContentEnabled: enabled,
    });
  }),
];
