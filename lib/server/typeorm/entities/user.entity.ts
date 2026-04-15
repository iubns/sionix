import { EntitySchema } from "typeorm";

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  openclawUrl: string | null;
  isEmailVerified: boolean;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}

export const UserEntitySchema = new EntitySchema<UserEntity>({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      type: "uuid",
      primary: true,
      generated: "uuid",
    },
    email: {
      type: String,
      unique: true,
    },
    passwordHash: {
      name: "password_hash",
      type: String,
    },
    openclawUrl: {
      name: "openclaw_url",
      type: String,
      nullable: true,
    },
    isEmailVerified: {
      name: "is_email_verified",
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      name: "email_verified_at",
      type: "timestamptz",
      nullable: true,
    },
    createdAt: {
      name: "created_at",
      type: "timestamptz",
      createDate: true,
    },
  },
});
