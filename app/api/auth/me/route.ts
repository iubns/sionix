import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  findUserByEmail,
  updateUserServiceIntegrations,
} from "@/lib/server/repositories/user.repository";
import type { ServiceIntegrations } from "@/lib/server/types/auth";
import { SERVICE_CATALOG } from "@/lib/shared/service-catalog";
import { requireAuth } from "@/lib/server/utils/api-auth";
import { ValidationError } from "@/lib/server/validators/auth.validator";

export const runtime = "nodejs";

type SupportedServiceKey = (typeof SERVICE_CATALOG)[number]["key"];

const SUPPORTED_SERVICE_KEYS = new Set<SupportedServiceKey>(
  SERVICE_CATALOG.map((service) => service.key),
);

const SERVICE_NAME_MAP = new Map<string, string>(
  SERVICE_CATALOG.map((service) => [service.key, service.label]),
);

function isSupportedServiceKey(key: string): key is SupportedServiceKey {
  return SUPPORTED_SERVICE_KEYS.has(key as SupportedServiceKey);
}

function normalizeOpenclawUrl(value: unknown): string | null {
  return normalizeServiceUrl("OpenClaw", value);
}

function normalizeServiceUrl(
  serviceLabel: string,
  value: unknown,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== "string") {
    throw new ValidationError(
      `${serviceLabel} 접속 주소 형식이 올바르지 않습니다.`,
    );
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(trimmed);
  } catch {
    throw new ValidationError(
      `${serviceLabel} 접속 주소 형식이 올바르지 않습니다.`,
    );
  }

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new ValidationError(
      `${serviceLabel} 접속 주소 형식이 올바르지 않습니다.`,
    );
  }

  return parsedUrl.toString();
}

function normalizeServiceIntegrationsPatch(
  value: unknown,
): ServiceIntegrations {
  if (value === null || value === undefined) {
    return {};
  }

  if (typeof value !== "object" || Array.isArray(value)) {
    throw new ValidationError("서비스 설정 형식이 올바르지 않습니다.");
  }

  const normalized: ServiceIntegrations = {};

  for (const [serviceKey, rawConfig] of Object.entries(value)) {
    if (!isSupportedServiceKey(serviceKey)) {
      throw new ValidationError(`지원하지 않는 서비스입니다: ${serviceKey}`);
    }
    const serviceLabel = SERVICE_NAME_MAP.get(serviceKey) as string;

    if (rawConfig === null) {
      normalized[serviceKey] = { url: null, enabled: false };
      continue;
    }

    if (typeof rawConfig === "string") {
      const normalizedUrl = normalizeServiceUrl(serviceLabel, rawConfig);
      normalized[serviceKey] = {
        url: normalizedUrl,
        enabled: normalizedUrl !== null,
      };
      continue;
    }

    if (typeof rawConfig !== "object" || Array.isArray(rawConfig)) {
      throw new ValidationError(
        `${serviceLabel} 설정 형식이 올바르지 않습니다.`,
      );
    }

    const config = rawConfig as { url?: unknown; enabled?: unknown };
    const normalizedUrl = normalizeServiceUrl(serviceLabel, config.url ?? null);
    const enabledFromInput =
      config.enabled === undefined ? normalizedUrl !== null : config.enabled;

    if (typeof enabledFromInput !== "boolean") {
      throw new ValidationError(
        `${serviceLabel} 활성화 값이 올바르지 않습니다.`,
      );
    }

    normalized[serviceKey] = {
      url: normalizedUrl,
      enabled: enabledFromInput && normalizedUrl !== null,
    };
  }

  return normalized;
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
          serviceIntegrations: user.serviceIntegrations,
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
    const bodyData = body as {
      openclawUrl?: unknown;
      services?: unknown;
    };
    const openclawUrl =
      bodyData.openclawUrl !== undefined
        ? normalizeOpenclawUrl(bodyData.openclawUrl)
        : undefined;
    const servicePatch = normalizeServiceIntegrationsPatch(bodyData.services);

    const user = await findUserByEmail(auth.payload.email);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const nextServiceIntegrations: ServiceIntegrations = {
      ...user.serviceIntegrations,
      ...servicePatch,
    };

    if (openclawUrl !== undefined) {
      nextServiceIntegrations.openclaw = {
        url: openclawUrl,
        enabled: openclawUrl !== null,
      };
    }

    await updateUserServiceIntegrations(user.id, nextServiceIntegrations);

    return NextResponse.json(
      {
        success: true,
        message: "서비스 설정이 저장되었습니다.",
        user: {
          id: user.id,
          email: user.email,
          provider: user.provider,
          openclawUrl: nextServiceIntegrations.openclaw?.url ?? null,
          serviceIntegrations: nextServiceIntegrations,
          isEmailVerified: user.isEmailVerified,
          emailVerifiedAt: user.emailVerifiedAt,
          createdAt: user.createdAt,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update service settings:", error);

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
        message: "서비스 설정 저장 중 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
