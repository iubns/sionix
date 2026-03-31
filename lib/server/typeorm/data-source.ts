import "reflect-metadata";

import { DataSource, type DataSourceOptions } from "typeorm";

import { EmailVerificationTokenEntitySchema } from "@/lib/server/typeorm/entities/email-verification-token.entity";
import { UserEntitySchema } from "@/lib/server/typeorm/entities/user.entity";

declare global {
  // eslint-disable-next-line no-var
  var __sionixDataSource: DataSource | undefined;
}

function getDataSourceOptions(): DataSourceOptions {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL 환경 변수가 필요합니다.");
  }

  return {
    type: "postgres",
    url: databaseUrl,
    entities: [UserEntitySchema, EmailVerificationTokenEntitySchema],
    synchronize: process.env.NODE_ENV !== "production",
  };
}

function buildDataSource(): DataSource {
  return new DataSource(getDataSourceOptions());
}

export async function getDataSource(): Promise<DataSource> {
  if (!globalThis.__sionixDataSource) {
    globalThis.__sionixDataSource = buildDataSource();
  }

  const dataSource = globalThis.__sionixDataSource;
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  return dataSource;
}
