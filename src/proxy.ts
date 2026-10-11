import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_DOCS_LOCALE } from "@/api/docs/types";
import { DOCS_BASE_PATH, docsPath, isDocsPathname } from "@/components/docs/docsPath";
import { isDevToolsEnabledFor } from "@/constants/identityVerification";

const MAINTENANCE_PATH = "/maintenance";

/** 배포 env 에 "on" 을 넣으면 점검 화면만 보인다. 되돌릴 때는 비우거나 다른 값을 넣는다. */
export const isMaintenanceMode = (value: string | undefined) => value === "on";

/**
 * 점검 모드. 켜지면 화면 요청을 전부 점검 안내로 돌린다(주소는 그대로 두고 내용만 바꾼다).
 * 정적 자원·이미지·점검 화면 자신은 matcher 에서 빠져 있어 그대로 나간다.
 */
export function proxy(request: NextRequest) {
  // 개발용 화면(/dev/**, 가짜 본인인증 등)은 운영(운영 호스트·운영 API)에서 없는 주소로 둔다. 페이지도 notFound 로 한 번 더 막는다.
  if (
    request.nextUrl.pathname.startsWith("/dev/") &&
    !isDevToolsEnabledFor(request.headers.get("host") ?? request.nextUrl.hostname)
  ) {
    return new NextResponse(null, { status: 404 });
  }
  // 문서 기준 경로는 기본 언어 홈으로 보낸다. 페이지(app/docs/page.tsx)에서도 보내지만, 루트 레이아웃의
  // Suspense 안에서는 응답이 이미 시작돼 200 + 클라이언트 이동이 되므로 여기서 진짜 307 로 보낸다.
  if (request.nextUrl.pathname === DOCS_BASE_PATH) {
    const url = request.nextUrl.clone();
    url.pathname = docsPath.home(DEFAULT_DOCS_LOCALE);
    return NextResponse.redirect(url);
  }
  if (!isMaintenanceMode(process.env.NEXT_PUBLIC_MAINTENANCE_MODE)) {
    return NextResponse.next();
  }
  // 점검 화면 자신과 가이드 문서(/docs)는 점검 중에도 연다. 문서는 점검 안내·이용 방법을 볼 수 있어야 한다.
  if (request.nextUrl.pathname === MAINTENANCE_PATH || isDocsPathname(request.nextUrl.pathname)) {
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
