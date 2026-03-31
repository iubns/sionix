import { EntitySchema } from "typeorm";

export interface EmailVerificationTokenEntity {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
}

export const EmailVerificationTokenEntitySchema =
  new EntitySchema<EmailVerificationTokenEntity>({
    name: "EmailVerificationToken",
    tableName: "email_verification_tokens",
    columns: {
      id: {
        type: "uuid",
        primary: true,
        generated: "uuid",
      },
      userId: {
        name: "user_id",
        type: "uuid",
      },
      tokenHash: {
        name: "token_hash",
        type: String,
        unique: true,
      },
      expiresAt: {
        name: "expires_at",
        type: "timestamptz",
      },
      consumedAt: {
        name: "consumed_at",
        type: "timestamptz",
        nullable: true,
      },
      createdAt: {
        name: "created_at",
        type: "timestamptz",
        createDate: true,
      },
    },
    indices: [
      {
        name: "idx_email_verification_tokens_user_id",
        columns: ["userId"],
      },
    ],
  });
