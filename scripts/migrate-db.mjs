import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";
import { Pool } from "pg";

config({ path: resolve(".env") });

const migrationDir = resolve("db/migrations");

async function ensureMigrationTable(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function getAppliedMigrations(pool) {
  const result = await pool.query(
    "SELECT name FROM schema_migrations ORDER BY name ASC",
  );
  return new Set(result.rows.map((row) => row.name));
}

async function applyMigration(pool, fileName) {
  const filePath = resolve(migrationDir, fileName);
  const sql = readFileSync(filePath, "utf8");

  console.log(`📄 Applying migration: ${fileName}`);
  await pool.query("BEGIN");

  try {
    await pool.query(sql);
    await pool.query("INSERT INTO schema_migrations (name) VALUES ($1)", [
      fileName,
    ]);
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}

async function migrateDatabase() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("DATABASE_URL 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    await ensureMigrationTable(pool);

    const appliedMigrations = await getAppliedMigrations(pool);
    const migrationFiles = readdirSync(migrationDir)
      .filter((fileName) => fileName.endsWith(".sql"))
      .sort();

    for (const fileName of migrationFiles) {
      if (appliedMigrations.has(fileName)) {
        continue;
      }

      await applyMigration(pool, fileName);
    }

    console.log("✅ Database migrations completed!");
  } catch (error) {
    console.error("❌ Database migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrateDatabase();
