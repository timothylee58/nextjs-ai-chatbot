/**
 * @file migrate.ts
 * @description Database migration runner script. Loads environment variables from
 * .env.local, connects to PostgreSQL using the POSTGRES_URL, and executes all
 * pending Drizzle ORM migrations from the lib/db/migrations folder. Gracefully
 * skips migration if POSTGRES_URL is not defined (e.g., during static builds).
 * Intended to be run as a standalone script during the build process.
 */

import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

config({
  path: ".env.local",
});

const runMigrate = async () => {
  if (!process.env.POSTGRES_URL) {
    console.log("⏭️  POSTGRES_URL not defined, skipping migrations");
    process.exit(0);
  }

  const connection = postgres(process.env.POSTGRES_URL, { max: 1 });
  const db = drizzle(connection);

  console.log("⏳ Running migrations...");

  const start = Date.now();
  await migrate(db, { migrationsFolder: "./lib/db/migrations" });
  const end = Date.now();

  console.log("✅ Migrations completed in", end - start, "ms");
  process.exit(0);
};

runMigrate().catch((err) => {
  console.error("❌ Migration failed");
  console.error(err);
  process.exit(1);
});
