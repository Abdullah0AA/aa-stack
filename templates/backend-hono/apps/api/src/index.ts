import { join } from "node:path";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import app from "./app";
import { config } from "./config";
import { db } from "./db";
import { rootLogger } from "./lib/logger";

// Deploys run `db:migrate` instead, so instances never race to migrate on boot.
if (config.NODE_ENV === "development") {
  migrate(db, { migrationsFolder: join(import.meta.dir, "../drizzle") });
}

const server = Bun.serve({
  hostname: config.HOST,
  port: config.PORT,
  fetch: app.fetch,
});

rootLogger.info(
  {
    url: server.url.href,
    port: server.port,
    environment: config.NODE_ENV,
  },
  "API server started",
);
