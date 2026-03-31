import { verify } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyToken, type TokenPayload } from "@/lib/server/utils/jwt";

export function getAuthorizationHeader(request: NextRequest): string | null {
  return request.headers.get("authorization");
}

export function getAccessTokenFromCookie(request: NextRequest): string | null {
  return request.cookies.get("accessToken")?.value ?? null;
}

export function extractTokenFromHeader(header: string): string | null {
  const parts = header.split(" ");
  if (parts.length === 2 && parts[0] === "Bearer") {
    return parts[1];
  }
  return null;
}

export function requireAuth(request: NextRequest):
  | {
      authorized: true;
      payload: TokenPayload;
    }
  | {
      authorized: false;
      response: NextResponse;
    } {
  try {
    // 쿠키에서 토큰 확인 (우선순위 1)
    let token = getAccessTokenFromCookie(request);

    // Authorization 헤더에서 토큰 확인 (우선순위 2)
    if (!token) {
      const authHeader = getAuthorizationHeader(request);
      if (authHeader) {
        token = extractTokenFromHeader(authHeader);
      }
    }

    if (!token) {
      return {
        authorized: false,
        response: NextResponse.json(
          { success: false, message: "인증이 필요합니다." },
          { status: 401 },
        ),
      };
    }

    const payload = verifyToken(token);
    return {
      authorized: true,
      payload,
    };
  } catch (error) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, message: "유효하지 않은 토큰입니다." },
        { status: 401 },
      ),
    };
  }
}
