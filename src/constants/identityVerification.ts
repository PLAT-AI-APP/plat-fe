/** dev 가짜 본인인증 페이지. 운영 빌드(NEXT_PUBLIC_APP_ENV=prod)에서는 404 다. */
export const DEV_IDENTITY_VERIFICATION_PATH = "/dev/identity-verification";

/** 인증 창(팝업) 이름. 같은 이름으로 다시 열면 새 창 대신 열린 창을 재사용한다. */
export const IDENTITY_VERIFICATION_WINDOW_NAME = "plat-identity-verification";

/**
 * 개발용 화면(/dev/**)을 열어도 되는 빌드인지.
 *
 * dev 서버와 운영 서버 모두 NODE_ENV=production 으로 돌아서 NODE_ENV 로는 가를 수 없다. 빌드 인자
 * NEXT_PUBLIC_APP_ENV 가 dev·local 일 때만 연다 — 값을 빠뜨린 빌드는 운영처럼 닫힌다(안전한 쪽 기본값).
 */
export const isDevToolsEnabled = (appEnv: string | undefined) =>
  appEnv === "dev" || appEnv === "local";
