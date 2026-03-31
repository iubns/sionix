import { NextResponse } from "next/server";

import {
  AuthError,
  verifyEmailByToken,
} from "@/lib/server/services/auth.service";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { success: false, message: "인증 토큰이 필요합니다." },
      { status: 400 },
    );
  }

  try {
    await verifyEmailByToken(token);

    return NextResponse.json(
      {
        success: true,
        message: "이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.",
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "이메일 인증 처리 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
