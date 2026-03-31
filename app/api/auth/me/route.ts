import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { findUserByEmail } from "@/lib/server/repositories/user.repository";
import { requireAuth } from "@/lib/server/utils/api-auth";

export const runtime = "nodejs";

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
