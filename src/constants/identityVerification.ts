/** dev 가짜 본인인증 페이지. 운영에서는 404 다(isDevToolsEnabled). */
export const DEV_IDENTITY_VERIFICATION_PATH = "/dev/identity-verification";

/** 인증 창(팝업) 이름. 같은 이름으로 다시 열면 새 창 대신 열린 창을 재사용한다. */
export const IDENTITY_VERIFICATION_WINDOW_NAME = "plat-identity-verification";

/** 운영 사이트 주소. 여기서는 무엇으로 빌드됐든 개발용 화면을 열지 않는다. */
const PRODUCTION_SITE_HOSTS = ["plat.so", "www.plat.so"];
/** 운영 API. 이 API 를 보는 빌드는 운영 빌드다. */
const PRODUCTION_API_HOSTS = ["api.plat.so"];
/**
 * 가짜 본인인증 제공자(MOCK)를 켤 수 있는 API. 서버도 prod 프로필에서는 가짜 제공자·가짜 완료 API 를 아예 띄우지 않는다.
 * 저장소의 .env.development·.env.production 이 기본으로 dev API 를 가리키므로 배포 환경변수를 따로 넣지 않아도 열린다.
 */
const NON_PRODUCTION_API_HOSTS = ["api-dev.plat.so", "localhost", "127.0.0.1"];

const hostnameOf = (value: string | null | undefined) => {
  if (!value) return null;
  try {
    return new URL(value.includes("://") ? value : `https://${value}`).hostname.toLowerCase();
  } catch {
    return null;
  }
};

export interface DevToolsContext {
  /** 빌드 인자 NEXT_PUBLIC_APP_ENV(local | dev | prod). 비어 있을 수 있다(Vercel 배포에 넣지 않은 경우). */
  appEnv: string | undefined;
  /** 이 빌드가 보는 API(NEXT_PUBLIC_BASE_URI). */
  apiBaseUri: string | undefined;
  /** 지금 열린 사이트 호스트(요청 Host·location.hostname). 모르면 비운다. */
  host?: string | null;
}

/**
 * 개발용 화면(/dev/**, 가짜 본인인증)을 열어도 되는지.
 *
 * dev 서버와 운영 서버 모두 NODE_ENV=production 이라 NODE_ENV 로는 가를 수 없고, NEXT_PUBLIC_APP_ENV 는 배포
 * 환경변수에 넣지 않으면 비어 있다. 그래서 "어느 API 를 보는가"로 가른다 — 가짜 인증 창은 결국 그 API 의 dev 전용
 * 완료 API 를 불러야 쓸모가 있고, 그 API 는 서버 prod 프로필에 없다.
 *
 * 닫는 쪽이 이긴다: APP_ENV=prod · 운영 사이트 호스트 · 운영 API 중 하나라도 해당하면 닫는다. 그 밖에는
 * APP_ENV 가 dev·local 이거나 API 가 알려진 개발 API 일 때만 연다(모르는 API 면 닫힌다).
 */
export const isDevToolsEnabled = ({ appEnv, apiBaseUri, host }: DevToolsContext) => {
  if (appEnv === "prod") return false;
  const siteHost = hostnameOf(host);
  if (siteHost && PRODUCTION_SITE_HOSTS.includes(siteHost)) return false;
  const apiHost = hostnameOf(apiBaseUri);
  if (apiHost && PRODUCTION_API_HOSTS.includes(apiHost)) return false;
  if (appEnv === "dev" || appEnv === "local") return true;
  return apiHost !== null && NON_PRODUCTION_API_HOSTS.includes(apiHost);
};

/** 이 빌드의 값으로 판단한다. 호스트는 호출하는 쪽이 넘긴다(서버: 요청 Host, 브라우저: location). */
export const isDevToolsEnabledFor = (host: string | null | undefined) =>
  isDevToolsEnabled({
    appEnv: process.env.NEXT_PUBLIC_APP_ENV,
    apiBaseUri: process.env.NEXT_PUBLIC_BASE_URI,
    host,
  });
