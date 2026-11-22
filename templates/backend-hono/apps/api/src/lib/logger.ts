import { pino } from "pino";
import { config } from "../config";

export const rootLogger = pino({
  base: undefined,
  level: config.LOG_LEVEL,
  transport:
    config.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:HH:MM:ss",
          },
        }
      : undefined,
});
