/**
 * 본인인증·성인인증·19 토글 판정의 단일 출처.
 *
 * 서버는 성인 콘텐츠를 보여 줄지 access 토큰 클레임(idu·adu·adm)으로 판단한다. 화면도 같은 값을 봐야
 * 목록 캐시가 서버 판단과 어긋나지 않는다. /users/me 를 기다리면 새로고침마다 "성인 아님"으로 한 번
 * 받았다가 다시 받게 되므로, 캐시 키는 토큰 클레임으로 정하고 화면 표시(배지·날짜)는 /users/me 값을 쓴다.
 */

/** 서버 JwtConstants 와 같은 이름. */
interface AdultTokenClaims {
  /** 본인인증 만료(epoch 초). 없으면 미인증. */
  idu?: number;
  /** 성인인증 만료(epoch 초). 없으면 미인증. */
  adu?: number;
  /** 19 토글. */
  adm?: boolean;
}

export interface AdultClaims {
  identityUntilMs: number | null;
  adultUntilMs: number | null;
  adultMode: boolean;
}

const EMPTY_CLAIMS: AdultClaims = {
  identityUntilMs: null,
  adultUntilMs: null,
  adultMode: false,
};

const decodeBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

const toEpochMs = (seconds: unknown) =>
  typeof seconds === "number" && Number.isFinite(seconds) ? seconds * 1000 : null;

/** 같은 토큰을 렌더마다 다시 풀지 않는다. 토큰은 한 번에 하나만 쓰므로 한 칸이면 충분하다. */
let lastDecoded: { token: string; claims: AdultClaims } | null = null;

/** 로그아웃·세션 만료 때 풀어 둔 토큰을 메모리에서 지운다. */
export const resetAdultClaimsCache = () => {
  lastDecoded = null;
};

/** access 토큰에서 인증 클레임만 읽는다. 서명은 검증하지 않는다 — 판단은 서버가 하고 여기선 캐시만 나눈다. */
export const readAdultClaims = (token: string | null | undefined): AdultClaims => {
  if (!token) return EMPTY_CLAIMS;
  if (lastDecoded?.token === token) return lastDecoded.claims;

  let claims = EMPTY_CLAIMS;
  try {
    const payload = token.split(".")[1];
    if (payload) {
      const parsed = JSON.parse(decodeBase64Url(payload)) as AdultTokenClaims;
      claims = {
        identityUntilMs: toEpochMs(parsed.idu),
        adultUntilMs: toEpochMs(parsed.adu),
        adultMode: parsed.adm === true,
      };
    }
  } catch {
    claims = EMPTY_CLAIMS;
  }

  lastDecoded = { token, claims };
  return claims;
};

/** 토큰 기준 성인인증이 지금 유효한지. 서버가 성인 세계관·방 접근을 허락하는 조건과 같다. */
export const hasAdultAccess = (token: string | null | undefined) => {
  const { adultUntilMs } = readAdultClaims(token);
  return adultUntilMs !== null && adultUntilMs > Date.now();
};

/** 토큰 기준 목록에 성인 콘텐츠가 섞이는지(성인인증 유효 + 19 토글). */
export const hasAdultMode = (token: string | null | undefined) =>
  hasAdultAccess(token) && readAdultClaims(token).adultMode;

/** 만료 30일 전부터 갱신을 권한다. */
export const RENEWAL_NOTICE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

export type VerificationStatus = "verified" | "renewSoon" | "expired" | "unverified";

/** /users/me 의 인증일·만료일로 화면에 보일 상태를 정한다. */
export const getVerificationStatus = (
  verifiedAt: string | null | undefined,
  verifiedUntil: string | null | undefined,
  now: number = Date.now(),
): VerificationStatus => {
  if (!verifiedUntil) return verifiedAt ? "expired" : "unverified";

  const untilMs = new Date(verifiedUntil).getTime();
  if (Number.isNaN(untilMs)) return "unverified";
  if (untilMs <= now) return "expired";
  if (untilMs - now <= RENEWAL_NOTICE_DAYS * DAY_MS) return "renewSoon";
  return "verified";
};

/** 지금 유효한 인증인지(갱신 권고 기간 포함). */
export const isVerificationValid = (
  verifiedUntil: string | null | undefined,
  now: number = Date.now(),
) => {
  if (!verifiedUntil) return false;
  const untilMs = new Date(verifiedUntil).getTime();
  return !Number.isNaN(untilMs) && untilMs > now;
};

/** 서버가 성인 콘텐츠 접근을 거부할 때의 코드(403). 세계관 상세·채팅방·채팅 시작에서 온다. */
export const ADULT_CONTENT_RESTRICTED = "ADULT_CONTENT_RESTRICTED";
/** 성인인증이 필요한 동작(19 토글 켜기, 성인 세계관 등록)을 무효한 인증으로 시도했을 때(403). */
export const ADULT_VERIFICATION_REQUIRED = "ADULT_VERIFICATION_REQUIRED";

/** react-query 에러(unknown)가 성인 콘텐츠 접근 거부인지. */
export const isAdultRestrictedError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  (error as { code?: unknown }).code === ADULT_CONTENT_RESTRICTED;
