import { NextResponse } from "next/server";

import { AuthError, login } from "@/lib/server/services/auth.service";
import {
  parseLoginInput,
  ValidationError,
} from "@/lib/server/validators/auth.validator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseLoginInput(body);
    const result = await login(input);

    const response = NextResponse.json(
      {
        success: true,
        message: "로그인에 성공했습니다.",
        user: result.user,
      },
      { status: 200 },
    );

    // httpOnly 쿠키에 토큰 저장 (보안)
    response.cookies.set("accessToken", result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1일
      path: "/",
    });

    response.cookies.set("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7일
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, message: "JSON 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    if (error instanceof AuthError) {
      const isEmailNotVerified =
        error.message.includes("이메일 인증이 필요합니다");
      return NextResponse.json(
        { success: false, message: error.message },
        { status: isEmailNotVerified ? 403 : 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
