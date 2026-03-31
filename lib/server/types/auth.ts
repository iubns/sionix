export type AuthProvider = "local";

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
  isEmailVerified: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  provider: AuthProvider;
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
