export type AuthProvider = "local";

import type { SupportedServiceKey } from "@/lib/shared/service-catalog";

export interface ServiceIntegrationConfig {
  url: string | null;
  enabled: boolean;
}

export type ServiceIntegrations = Partial<
  Record<SupportedServiceKey, ServiceIntegrationConfig>
>;

export interface SignupInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UserRecord {
  id: string;
  email: string;
  passwordHash: string;
  provider: AuthProvider;
  openclawUrl: string | null;
  serviceIntegrations: ServiceIntegrations;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  provider: AuthProvider;
  openclawUrl: string | null;
  serviceIntegrations: ServiceIntegrations;
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface SignupResult {
  user: PublicUser;
  verificationRequired: boolean;
  verificationToken?: string;
  verificationUrl?: string;
}

export interface LoginResult {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}
