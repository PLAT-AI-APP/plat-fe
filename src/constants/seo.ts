// 검색 엔진 수집 허용 여부. 클로즈베타 동안은 막아 두고, 정식 출시 때 배포 env 에 "true" 를 넣어 연다.
export const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

/**
 * 사이트 기준 주소. 공유 미리보기(OG)의 상대 경로가 이 주소로 풀린다.
 * dev·로컬은 환경 변수로 바꾸고, 없으면 운영 도메인을 쓴다.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://plat.so";

const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV;

/**
 * 탭 제목 앞에 붙이는 환경 표시. dev·운영 탭을 헷갈리지 않게 한다.
 * APP_ENV 가 비어 있는 배포도 있어 dev·local 일 때만 붙인다(비었다고 붙이면 운영에 dev 가 뜬다).
 */
export const TITLE_PREFIX =
  APP_ENV === "dev" || APP_ENV === "local" ? `${APP_ENV}: ` : "";
