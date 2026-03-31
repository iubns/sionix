import { createHash } from "node:crypto";

import {
  createUser,
  findUserByEmail,
} from "@/lib/server/repositories/user.repository";
import type {
  LoginInput,
  PublicUser,
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

function hashPassword(password: string): string {
  const salt = process.env.AUTH_SALT ?? "dev-salt-change-me";
  return createHash("sha256").update(`${password}:${salt}`).digest("hex");
}

function toPublicUser(user: UserRecord): PublicUser {
  return {
    id: user.id,
    email: user.email,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

export async function signup(input: SignupInput): Promise<PublicUser> {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new AuthError("이미 가입된 이메일입니다.");
  }

  try {
    const user = await createUser({
      email: input.email,
      passwordHash: hashPassword(input.password),
    });

    return toPublicUser(user);
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

export async function login(input: LoginInput): Promise<PublicUser> {
  const user = await findUserByEmail(input.email);
  if (!user) {
    throw new AuthError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  const incomingHash = hashPassword(input.password);
  if (incomingHash !== user.passwordHash) {
    throw new AuthError("이메일 또는 비밀번호가 올바르지 않습니다.");
  }

  return toPublicUser(user);
}
