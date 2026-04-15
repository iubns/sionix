import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  findUserByEmail,
  updateUserOpenclawUrl,
} from "@/lib/server/repositories/user.repository";
import { requireAuth } from "@/lib/server/utils/api-auth";
import { ValidationError } from "@/lib/server/validators/auth.validator";

export const runtime = "nodejs";

function normalizeOpenclawUrl(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new ValidationError("OpenClaw 접속 주소 형식이 올바르지 않습니다.");
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new ValidationError("OpenClaw 접속 주소 형식이 올바르지 않습니다.");
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new ValidationError("OpenClaw 접속 주소 형식이 올바르지 않습니다.");
  }

  return parsedUrl.toString();
}

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const user = await findUserByEmail(auth.payload.email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          provider: user.provider,
          openclawUrl: user.openclawUrl,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt,
          createdAt: user.createdAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "사용자 정보 조회 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  const auth = requireAuth(request);

  if (!auth.authorized) {
    return auth.response;
  }

  try {
    const body = await request.json();
    const openclawUrl = normalizeOpenclawUrl(
      (body as { openclawUrl?: unknown }).openclawUrl,
    );

    const user = await findUserByEmail(auth.payload.email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    await updateUserOpenclawUrl(user.id, openclawUrl);

    return NextResponse.json(
      {
        success: true,
        message: "OpenClaw 접속 주소가 저장되었습니다.",
        user: {
          id: user.id,
          email: user.email,
          provider: user.provider,
          openclawUrl,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt,
          createdAt: user.createdAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update OpenClaw URL:", error);

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

    return NextResponse.json(
      {
        success: false,
        message: "OpenClaw 접속 주소 저장 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
