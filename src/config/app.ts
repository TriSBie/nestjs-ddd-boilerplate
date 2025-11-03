import { getEnv } from "../env";

import type { AppConfig } from "./type";

const loadConfig = (): AppConfig => {
  return {
    env: {
      type: getEnv("NODE_ENV", "development"),
    },
    api: {
      port: Number(getEnv("API_PORT", "5555")),
      path: getEnv("API_URL", "http://localhost"),
      url: `${getEnv("API_URL", "http://localhost")}${process.env.API_PORT && getEnv("NODE_ENV", "development") === "development"
        ? `:${Number(getEnv("API_PORT", "5555"))}`
        : ""
        }/v2`,
      keyPrefix: getEnv("API_KEY_PREFIX", "cal_"),
    },
    db: {
      url: getEnv("DATABASE_URL"),
      redisUrl: getEnv("REDIS_URL"),
    },
    next: {
      authSecret: getEnv("NEXTAUTH_SECRET"),
    },
    app: {
      baseUrl: getEnv("WEB_APP_URL", "https://app.cal.com"),
    },
    hash: {
      saltRounds: Number(getEnv("HASH_SALT_ROUNDS", 12)),
    },
  };
};

export default loadConfig;
