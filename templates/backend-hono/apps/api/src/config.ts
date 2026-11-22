import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1).default("local.db"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.ipv4().default("127.0.0.1"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"]).default("info"),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid API configuration:");
  for (const issue of result.error.issues) {
    const name = issue.path.join(".");
    const message = process.env[name] === undefined ? "Required" : issue.message;
    console.error(`  ${name}: ${message}`);
  }
  process.exit(1);
}

export const config = result.data;
