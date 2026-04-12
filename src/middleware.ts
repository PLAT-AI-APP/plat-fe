import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  // 홈화면이 아니라 '마이페이지' 같은 곳이라면?
  if (!token && request.nextUrl.pathname.startsWith("/mypage")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
