export type AppConfig = {
  env: {
    type: "production" | "development";
  };
  api: {
    port: number;
    path: string;
    url: string;
    keyPrefix: string;
  };
  db: {
    url: string;
    redisUrl: string;
  };
  next: {
    authSecret: string;
  };
  app: {
    baseUrl: string;
  };
  hash: {
    saltRounds: number;
  };
};
