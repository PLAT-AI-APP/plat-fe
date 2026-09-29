import { NextResponse, type NextRequest } from "next/server";

const MAINTENANCE_PATH = "/maintenance";

/** 배포 env 에 "on" 을 넣으면 점검 화면만 보인다. 되돌릴 때는 비우거나 다른 값을 넣는다. */
export const isMaintenanceMode = (value: string | undefined) => value === "on";

/**
 * 점검 모드. 켜지면 화면 요청을 전부 점검 안내로 돌린다(주소는 그대로 두고 내용만 바꾼다).
 * 정적 자원·이미지·점검 화면 자신은 matcher 에서 빠져 있어 그대로 나간다.
 */
export function proxy(request: NextRequest) {
  if (!isMaintenanceMode(process.env.NEXT_PUBLIC_MAINTENANCE_MODE)) {
    return NextResponse.next();
  }
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
