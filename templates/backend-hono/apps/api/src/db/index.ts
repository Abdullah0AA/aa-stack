import { drizzle } from "drizzle-orm/bun-sqlite";
import { config } from "../config";

export const db = drizzle(config.DATABASE_URL);
