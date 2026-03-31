import { Pool } from "pg";
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: resolve(".env") });

async function initializeDatabase() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const sqlPath = resolve("db/init.sql");
    const sql = readFileSync(sqlPath, "utf8");

    console.log("📊 데이터베이스 스키마 초기화 중...");
    await pool.query(sql);
    console.log("✅ 데이터베이스 초기화 완료!");

    const result = await pool.query(
      "SELECT tablename FROM pg_tables WHERE schemaname='public';"
    );
    console.log(
      "\n📋 생성된 테이블:",
      result.rows.map((row) => row.tablename).join(", ")
    );
  } catch (error) {
    console.error("❌ 데이터베이스 초기화 실패:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initializeDatabase();
