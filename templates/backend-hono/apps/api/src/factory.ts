import { createFactory } from "hono/factory";
import type { Logger } from "pino";

export type AppEnv = {
  Variables: {
    logger: Logger;
  };
};

const factory = createFactory<AppEnv>({
  defaultAppOptions: {
    strict: false,
  },
});

export default factory;
