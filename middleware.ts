import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/server/utils/jwt";

export function middleware(request: NextRequest) {
  // 인증이 필요한 경로 (필요시 추가)
  const protectedPaths = ["/api/protected"];

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // 쿠키에서 accessToken 추출
  const accessToken = request.cookies.get("accessToken")?.value;

  if (!accessToken) {
    // API 요청인 경우 401 응답
    return NextResponse.json(
      { success: false, message: "인증이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    // 토큰 검증
    const payload = verifyToken(accessToken);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "인증이 만료되었습니다." },
      { status: 401 },
    );
  }
}

// middleware가 실행될 경로
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /login, /signup, /api/auth (auth pages and routes)
     * - /public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|login|signup|api/auth|public).*)",
  ],
};
