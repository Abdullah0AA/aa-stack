import type { AppType } from "api/rpc";
import { hc } from "hono/client";

export const api = hc<AppType>("/").api;
