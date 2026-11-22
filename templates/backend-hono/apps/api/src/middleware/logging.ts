import { type Logger } from "pino";

import { structuredLogger } from "@hono/structured-logger";
import { requestId, type RequestIdVariables } from "hono/request-id";
import { every } from "hono/combine";
import { rootLogger } from "../lib/logger";

export const requestLogger = every(
  requestId(),
  structuredLogger<{ Variables: RequestIdVariables }, Logger>({
    createLogger: (c) => rootLogger.child({ requestId: c.var.requestId }),

    onResponse: (logger, c, elapsedMs) =>
      logger.info(
        {
          method: c.req.method,
          path: c.req.path,
          status: c.res.status,
          elapsedMs: Math.round(elapsedMs * 100) / 100,
        },
        "request completed",
      ),
    onError: (logger, err, c, elapsedMs) =>
      logger.error(
        {
          err,
          method: c.req.method,
          path: c.req.path,
          status: c.res.status,
          elapsedMs,
        },
        "request failed",
      ),
  }),
);
