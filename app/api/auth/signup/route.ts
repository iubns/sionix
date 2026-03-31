import { NextResponse } from "next/server";

import {
  AuthError,
  InternalAuthServiceError,
  signup,
} from "@/lib/server/services/auth.service";
import {
  parseSignupInput,
  ValidationError,
} from "@/lib/server/validators/auth.validator";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = parseSignupInput(body);
    const user = await signup(input);

    return NextResponse.json(
      {
        success: true,
        message: "회원가입이 완료되었습니다.",
        user,
      },
      { status: 201 },
    );
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
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 409 },
      );
    }

    if (error instanceof InternalAuthServiceError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: false, message: "알 수 없는 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
