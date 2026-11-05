import { NextResponse, type NextRequest } from "next/server";
import {
  DOCS_BASE_PATH,
  DOCS_SITE_URL,
  isDocsPathname,
} from "@/components/docs/docsPath";
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
  // 문서는 문서 전용 사이트로 옮겼다. 예전 앱 안 주소(/docs/ko/articles/x 등)로 들어와도 같은 문서가 열리도록
  // 기준 경로만 떼고 문서 사이트의 같은 경로로 보낸다. 언어 고르기(?lang=)도 문서 사이트가 그대로 받는다.
  if (isDocsPathname(request.nextUrl.pathname)) {
    const rest = request.nextUrl.pathname.slice(DOCS_BASE_PATH.length) || "/";
    return NextResponse.redirect(`${DOCS_SITE_URL}${rest}${request.nextUrl.search}`);
  }
  if (!isMaintenanceMode(process.env.NEXT_PUBLIC_MAINTENANCE_MODE)) {
    return NextResponse.next();
  }
  // 점검 화면 자신은 점검 중에도 연다. 문서(/docs)는 위에서 이미 문서 사이트로 보냈다.
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
