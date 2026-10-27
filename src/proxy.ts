import { NextResponse, type NextRequest } from "next/server";
// 예전 앱 안 문서 화면(/docs)용. 문서가 docs.plat.so 로 옮겨 가 지금은 쓰지 않는다(아래 주석 처리한 코드와 함께 남김).
// import { getDocsLocales } from "@/api/docs/server";
// import {
//   DOCS_BASE_PATH,
//   DOCS_ENTRY_LANG_PARAM,
//   docsPath,
//   isDocsPathname,
//   pickDocsEntryLocale,
// } from "@/components/docs/docsPath";
import { isLegacyDocsPathname, legacyDocsToSiteUrl } from "@/constants/docs";
import { isDevToolsEnabledFor } from "@/constants/identityVerification";

const MAINTENANCE_PATH = "/maintenance";

/** 배포 env 에 "on" 을 넣으면 점검 화면만 보인다. 되돌릴 때는 비우거나 다른 값을 넣는다. */
export const isMaintenanceMode = (value: string | undefined) => value === "on";

/**
 * 점검 모드. 켜지면 화면 요청을 전부 점검 안내로 돌린다(주소는 그대로 두고 내용만 바꾼다).
 * 정적 자원·이미지·점검 화면 자신은 matcher 에서 빠져 있어 그대로 나간다.
 */
export async function proxy(request: NextRequest) {
  // 개발용 화면(/dev/**, 가짜 본인인증 등)은 운영(운영 호스트·운영 API)에서 없는 주소로 둔다. 페이지도 notFound 로 한 번 더 막는다.
  if (
    request.nextUrl.pathname.startsWith("/dev/") &&
    !isDevToolsEnabledFor(request.headers.get("host") ?? request.nextUrl.hostname)
  ) {
    return new NextResponse(null, { status: 404 });
  }
  // 문서는 따로 배포된 사이트(docs.plat.so)로 옮겨 갔다. 예전 주소(/docs, /docs/...)로 오면 같은 화면의 새 주소로 영구 이동(308)한다.
  // 공지·즐겨찾기에 남은 링크가 깨지지 않게 하려는 것이고, 점검 모드보다 먼저 보내 점검 중에도 문서를 볼 수 있다.
  if (isLegacyDocsPathname(request.nextUrl.pathname)) {
    return NextResponse.redirect(legacyDocsToSiteUrl(request.nextUrl.pathname, request.nextUrl.search), 308);
  }
  // 예전 앱 안 문서 화면(/docs)의 언어 진입 처리. 위 이동으로 대신해 지금은 쓰지 않는다.
  // // 문서 기준 경로는 앱에서 넘긴 언어(?lang=)가 지원되면 그 언어, 아니면 문서 레포가 정한 기본 언어 홈으로 보낸다. 페이지(app/docs/page.tsx)에서도 보내지만, 루트 레이아웃의
  // // Suspense 안에서는 응답이 이미 시작돼 200 + 클라이언트 이동이 되므로 여기서 진짜 307 로 보낸다.
  // // 언어 목록을 못 받으면 그대로 넘겨 페이지가 오류 화면을 보이게 한다.
  // if (request.nextUrl.pathname === DOCS_BASE_PATH) {
  //   const locales = await getDocsLocales().catch(() => null);
  //   if (locales) {
  //     const url = request.nextUrl.clone();
  //     url.pathname = docsPath.home(pickDocsEntryLocale(url.searchParams.get(DOCS_ENTRY_LANG_PARAM), locales));
  //     url.search = "";
  //     return NextResponse.redirect(url);
  //   }
  // }
  if (!isMaintenanceMode(process.env.NEXT_PUBLIC_MAINTENANCE_MODE)) {
    return NextResponse.next();
  }
  // 점검 화면 자신은 점검 중에도 연다. (예전에는 앱 안 문서 화면(/docs)도 열었다. 지금은 위에서 docs.plat.so 로 보낸다.)
  // if (request.nextUrl.pathname === MAINTENANCE_PATH || isDocsPathname(request.nextUrl.pathname)) {
  if (request.nextUrl.pathname === MAINTENANCE_PATH) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = MAINTENANCE_PATH;
  url.search = "";
  return NextResponse.rewrite(url, { status: 503 });
}

export const config = {
  // _next(번들·이미지 최적화), 정적 파일(확장자가 있는 경로), 목업 워커는 점검 중에도 나가야 화면이 그려진다.
  matcher: ["/((?!_next/|api/|images/|ai-logo/|favicon\\.ico|mockServiceWorker\\.js|.*\\.[a-zA-Z0-9]+$).*)"],
};
