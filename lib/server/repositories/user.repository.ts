import { query } from "@/lib/server/db";
import type { UserRecord } from "@/lib/server/types/auth";

function toEmailKey(email: string): string {
  return email.trim().toLowerCase();
}

function toUserRecord(row: Record<string, unknown>): UserRecord {
  return {
    id: String(row.id),
    email: String(row.email),
    passwordHash: String(row.password_hash),
    provider: "local",
    createdAt: String(row.created_at),
  };
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalizedEmail = toEmailKey(email);
  const result = await query(
    "SELECT id, email, password_hash, created_at FROM users WHERE email = $1 LIMIT 1",
    [normalizedEmail],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return toUserRecord(row);
}

export async function createUser(params: {
  email: string;
  passwordHash: string;
}): Promise<UserRecord> {
  const normalizedEmail = toEmailKey(params.email);
  const result = await query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, password_hash, created_at`,
    [normalizedEmail, params.passwordHash],
  );

  return toUserRecord(result.rows[0]);
}
