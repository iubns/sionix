import { getDataSource } from "@/lib/server/typeorm/data-source";
import {
  type UserEntity,
  UserEntitySchema,
} from "@/lib/server/typeorm/entities/user.entity";
import type { UserRecord } from "@/lib/server/types/auth";

function toEmailKey(email: string): string {
  return email.trim().toLowerCase();
}

function toUserRecord(row: UserEntity): UserRecord {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    provider: "local",
    createdAt: row.createdAt.toISOString(),
  };
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const normalizedEmail = toEmailKey(email);
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(UserEntitySchema);
  const row = await repository.findOne({ where: { email: normalizedEmail } });

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
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(UserEntitySchema);

  const user = repository.create({
    email: normalizedEmail,
    passwordHash: params.passwordHash,
  });

  const saved = await repository.save(user);
  return toUserRecord(saved);
}
