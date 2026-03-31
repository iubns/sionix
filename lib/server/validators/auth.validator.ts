import type { LoginInput, SignupInput } from "@/lib/server/types/auth";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function assertValidEmail(email: string): void {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    throw new ValidationError("유효한 이메일 형식이 아닙니다.");
  }
}

function assertValidPassword(password: string): void {
  if (password.length < 8) {
    throw new ValidationError("비밀번호는 8자 이상이어야 합니다.");
  }
}

export function parseSignupInput(body: unknown): SignupInput {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("요청 본문 형식이 올바르지 않습니다.");
  }

  const raw = body as Record<string, unknown>;
  const email = normalizeEmail(String(raw.email ?? ""));
  const password = String(raw.password ?? "");
  const confirmPassword = String(raw.confirmPassword ?? "");

  assertValidEmail(email);
  assertValidPassword(password);

  if (password !== confirmPassword) {
    throw new ValidationError("비밀번호 확인이 일치하지 않습니다.");
  }

  return { email, password, confirmPassword };
}

export function parseLoginInput(body: unknown): LoginInput {
  if (typeof body !== "object" || body === null) {
    throw new ValidationError("요청 본문 형식이 올바르지 않습니다.");
  }

  const raw = body as Record<string, unknown>;
  const email = normalizeEmail(String(raw.email ?? ""));
  const password = String(raw.password ?? "");

  assertValidEmail(email);
  assertValidPassword(password);

  return { email, password };
}
