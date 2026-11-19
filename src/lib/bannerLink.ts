/** 배너 이동 대상. 앱 안이면 Next 라우터로, 밖이면 새 탭으로 연다. */
export interface BannerLinkTarget {
  href: string;
  external: boolean;
}

/** 앱 딥링크(plat://종류/값)의 종류별 화면 주소. 서버가 늘리면 여기에 더한다. */
const DEEP_LINK_ROUTES: Record<string, (value: string) => string> = {
  universe: (id) => `/characters/${encodeURIComponent(id)}`,
};

const DEEP_LINK_PREFIX = "plat://";

/**
 * 서버가 준 배너 linkUrl 을 화면 주소로 바꾼다.
 *
 * 서버는 앱 안으로 보내는 배너에 딥링크(`plat://universe/123`)를, 밖으로 보내는 배너에 `https://` 주소를 준다.
 * 딥링크를 그대로 Link 에 넘기면 브라우저가 모르는 프로토콜로 이동하려다 아무 일도 일어나지 않으므로,
 * 아는 딥링크만 웹 경로로 바꾸고 모르는 종류·형식은 null(이동 없음)로 둔다 — 배너 자체는 그대로 보인다.
 */
export const resolveBannerLink = (
  linkUrl: string | null | undefined,
): BannerLinkTarget | null => {
  const url = linkUrl?.trim();
  if (!url) return null;

  if (url.startsWith(DEEP_LINK_PREFIX)) {
    const [kind, value, ...rest] = url.slice(DEEP_LINK_PREFIX.length).split("/");
    const toRoute = DEEP_LINK_ROUTES[kind];
    if (!toRoute || !value || rest.length > 0) return null;

    return { href: toRoute(value), external: false };
  }

  // 앱 안 경로(`/…`)는 그대로. `//` 로 시작하는 주소는 다른 사이트라 앱 안으로 보지 않는다.
  if (
    url.startsWith("/") &&
    !url.startsWith("//") &&
    !url.startsWith("/\\") &&
    ![...url].some((char) => char.charCodeAt(0) < 32)
  ) {
    return { href: url, external: false };
  }

  // 밖으로 나가는 주소는 http(s) 만 받는다(javascript: 같은 것은 막는다).
  if (/^https?:\/\//i.test(url)) return { href: url, external: true };

  return null;
};
