import { getDataSource } from "@/lib/server/typeorm/data-source";
import {
  EmailVerificationTokenEntitySchema,
  type EmailVerificationTokenEntity,
} from "@/lib/server/typeorm/entities/email-verification-token.entity";
import {
  type UserEntity,
  UserEntitySchema,
} from "@/lib/server/typeorm/entities/user.entity";
import type { ServiceIntegrations, UserRecord } from "@/lib/server/types/auth";
import { SERVICE_CATALOG } from "@/lib/shared/service-catalog";

type SupportedServiceKey = (typeof SERVICE_CATALOG)[number]["key"];

const SUPPORTED_SERVICE_KEYS = new Set(
  SERVICE_CATALOG.map((service) => service.key),
);

function isSupportedServiceKey(key: string): key is SupportedServiceKey {
  return SUPPORTED_SERVICE_KEYS.has(key as SupportedServiceKey);
}

function toEmailKey(email: string): string {
  return email.trim().toLowerCase();
}

function normalizeServiceIntegrations(value: unknown): ServiceIntegrations {
  if (!value || typeof value !== "object") {
    return {};
  }

  const integrations: ServiceIntegrations = {};

  for (const [key, rawConfig] of Object.entries(value)) {
    if (!isSupportedServiceKey(key)) {
      continue;
    }

    if (!rawConfig || typeof rawConfig !== "object") {
      continue;
    }

    const config = rawConfig as { url?: unknown; enabled?: unknown };
    const normalizedUrl =
      typeof config.url === "string" && config.url.trim().length > 0
        ? config.url.trim()
        : null;

    const normalizedEnabled =
      typeof config.enabled === "boolean"
        ? config.enabled
        : normalizedUrl !== null;

    integrations[key] = {
      url: normalizedUrl,
      enabled: normalizedEnabled && normalizedUrl !== null,
    };
  }

  return integrations;
}

function toUserRecord(row: UserEntity): UserRecord {
  const serviceIntegrations = normalizeServiceIntegrations(
    row.serviceIntegrations,
  );
  const openclawFromServices = serviceIntegrations.openclaw?.url ?? null;

  if (row.openclawUrl && !openclawFromServices) {
    serviceIntegrations.openclaw = {
      url: row.openclawUrl,
      enabled: true,
    };
  }

  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    provider: "local",
    openclawUrl: serviceIntegrations.openclaw?.url ?? row.openclawUrl,
    serviceIntegrations,
    isEmailVerified: row.isEmailVerified,
    emailVerifiedAt: row.emailVerifiedAt
      ? row.emailVerifiedAt.toISOString()
      : null,
    createdAt: row.createdAt.toISOString(),
  };
}

function toEmailVerificationTokenRecord(row: EmailVerificationTokenEntity): {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
} {
  return {
    id: row.id,
    userId: row.userId,
    tokenHash: row.tokenHash,
    expiresAt: row.expiresAt,
    consumedAt: row.consumedAt,
  };
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const normalizedEmail = toEmailKey(email);
  try {
    const dataSource = await getDataSource();
    const repository = dataSource.getRepository(UserEntitySchema);
    const row = await repository.findOne({ where: { email: normalizedEmail } });

    if (!row) {
      return null;
    }

    return toUserRecord(row);
  } catch (error) {
    console.error("Failed to get data source:", error);
    throw error;
  }
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
    openclawUrl: null,
    serviceIntegrations: {},
  });

  const saved = await repository.save(user);
  return toUserRecord(saved);
}

export async function createEmailVerificationToken(params: {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<void> {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(
    EmailVerificationTokenEntitySchema,
  );

  const token = repository.create({
    userId: params.userId,
    tokenHash: params.tokenHash,
    expiresAt: params.expiresAt,
  });

  await repository.save(token);
}

export async function findEmailVerificationTokenByHash(
  tokenHash: string,
): Promise<{
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
} | null> {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(
    EmailVerificationTokenEntitySchema,
  );

  const token = await repository.findOne({ where: { tokenHash } });
  if (!token) {
    return null;
  }

  return toEmailVerificationTokenRecord(token);
}

export async function consumeEmailVerificationToken(id: string): Promise<void> {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(
    EmailVerificationTokenEntitySchema,
  );

  await repository.update({ id }, { consumedAt: new Date() });
}

export async function markUserEmailAsVerified(userId: string): Promise<void> {
  const dataSource = await getDataSource();
  const repository = dataSource.getRepository(UserEntitySchema);

  await repository.update(
    { id: userId },
    {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
    },
  );
}

export async function updateUserServiceIntegrations(
  userId: string,
  serviceIntegrations: ServiceIntegrations,
): Promise<void> {
  const dataSource = await getDataSource();
  const openclawUrl = serviceIntegrations.openclaw?.url ?? null;

  await dataSource.query(
    `
      UPDATE users
      SET
        service_integrations = $1::jsonb,
        openclaw_url = $2
      WHERE id = $3
    `,
    [JSON.stringify(serviceIntegrations), openclawUrl, userId],
  );
}
