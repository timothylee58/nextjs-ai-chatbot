import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit Configuration
 *
 * Configures the Drizzle ORM CLI tool for database schema management.
 * Used for generating and running SQL migrations against the PostgreSQL database.
 *
 * Commands:
 *   pnpm db:generate  — Generate migration files from schema changes
 *   pnpm db:migrate   — Apply pending migrations to the database
 *   pnpm db:studio    — Open Drizzle Studio (visual DB browser)
 */

// Load database connection string from .env.local
config({
  path: ".env.local",
});

export default defineConfig({
  // Points to the file where all database tables/columns are defined
  schema: "./lib/db/schema.ts",

  // Directory where generated SQL migration files are stored
  out: "./lib/db/migrations",

  // Database engine (PostgreSQL via AWS Aurora)
  dialect: "postgresql",

  // Connection URL loaded from POSTGRES_URL environment variable
  dbCredentials: {
    // biome-ignore lint: Forbidden non-null assertion.
    url: process.env.POSTGRES_URL!,
  },
});
