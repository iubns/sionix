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
  createdAt: string;
}

export interface PublicUser {
  id: string;
  email: string;
  provider: AuthProvider;
  createdAt: string;
}
