import { compare, hash } from "bcryptjs";
import { createHash, randomBytes } from "node:crypto";

import {
  consumeEmailVerificationToken,
  createEmailVerificationToken,
  createUser,
  findEmailVerificationTokenByHash,
  findUserByEmail,
  markUserEmailAsVerified,
} from "@/lib/server/repositories/user.repository";
import { sendVerificationEmail } from "@/lib/server/services/email.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/server/utils/jwt";
import type {
  LoginInput,
  LoginResult,
  PublicUser,
  SignupResult,
  SignupInput,
  UserRecord,
} from "@/lib/server/types/auth";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

export class InternalAuthServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InternalAuthServiceError";
  }
}

async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return hash(password, saltRounds);
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    provider: user.provider,
    isEmailVerified: user.isEmailVerified,
    emailVerifiedAt: user.emailVerifiedAt,
    createdAt: user.createdAt,
  };
}

function buildTokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function buildVerificationUrl(token: string): string {
  const baseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  return `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
}

export async function signup(input: SignupInput): Promise<SignupResult> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new AuthError("이미 가입된 이메일입니다.");
  }

  try {
    const passwordHash = await hashPassword(input.password);
    const user = await createUser({
      email: input.email,
      passwordHash,
    });

    const verificationToken = randomBytes(32).toString("hex");
    const verificationTokenHash = buildTokenHash(verificationToken);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30);
    const verificationUrl = buildVerificationUrl(verificationToken);

    await createEmailVerificationToken({
      userId: user.id,
      tokenHash: verificationTokenHash,
      expiresAt,
    });

    try {
      await sendVerificationEmail({
        to: user.email,
        verificationUrl,
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
    }

    return {
      user: toPublicUser(user),
      verificationRequired: true,
      verificationUrl:
        process.env.NODE_ENV === "production" ? undefined : verificationUrl,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "DB 오류";
    const errorCode =
      typeof error === "object" && error !== null
        ? String(
            (error as { code?: unknown; driverError?: { code?: unknown } })
              .code ??
              (error as { driverError?: { code?: unknown } }).driverError
                ?.code ??
              "",
          )
        : "";

    if (
      errorCode === "23505" ||
      message.includes("duplicate key") ||
      message.includes("users_email_key")
    ) {
      throw new AuthError("이미 가입된 이메일입니다.");
    }

    throw new InternalAuthServiceError(
      "회원가입 처리 중 DB 오류가 발생했습니다.",
    );
  }
}

export async function login(input: LoginInput): Promise<LoginResult> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AuthError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  if (!user.isEmailVerified) {
    throw new AuthError("이메일 인증이 필요합니다. 메일함을 확인해 주세요.");
  }

  const passwordMatch = await compare(input.password, user.passwordHash);
  if (!passwordMatch) {
    throw new AuthError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const publicUser = toPublicUser(user);
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
  });
  const refreshToken = generateRefreshToken({
    userId: user.id,
    email: user.email,
  });

  return {
    user: publicUser,
    accessToken,
    refreshToken,
  };
}

export async function verifyEmailByToken(token: string): Promise<void> {
  const tokenHash = buildTokenHash(token);
  const stored = await findEmailVerificationTokenByHash(tokenHash);

  if (!stored) {
    throw new AuthError("유효하지 않은 인증 토큰입니다.");
  }

  if (stored.consumedAt) {
    throw new AuthError("이미 사용된 인증 토큰입니다.");
  }

  if (stored.expiresAt.getTime() < Date.now()) {
    throw new AuthError(
      "만료된 인증 토큰입니다. 다시 회원가입을 진행해 주세요.",
    );
  }

  await markUserEmailAsVerified(stored.userId);
  await consumeEmailVerificationToken(stored.id);
}
