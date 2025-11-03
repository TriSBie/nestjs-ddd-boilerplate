import { logLevels } from './lib/logger';

// TODO: Add all the environment variables here
export type Environment = {
    NODE_ENV: 'development' | 'production';
    API_PORT: string;
    API_URL: string;
    DATABASE_URL: string;
    NEXTAUTH_SECRET: string;
    SENTRY_DSN: string;
    SENTRY_TRACES_SAMPLE_RATE?: number;
    SENTRY_PROFILES_SAMPLE_RATE?: number;
    LOG_LEVEL: keyof typeof logLevels;
    REDIS_URL: string;
    WEB_APP_URL: string;
    API_KEY_PREFIX: string;
    DOCS_URL: string;
    RATE_LIMIT_DEFAULT_TTL_MS: number;
    RATE_LIMIT_DEFAULT_LIMIT_API_KEY: number;
    RATE_LIMIT_DEFAULT_LIMIT_OAUTH_CLIENT: number;
    RATE_LIMIT_DEFAULT_LIMIT_ACCESS_TOKEN: number;
    RATE_LIMIT_DEFAULT_LIMIT: number;
    RATE_LIMIT_DEFAULT_BLOCK_DURATION_MS: number;
    HASH_SALT_ROUNDS: number;
    JWT_EXPIRATION_TIME: number;
    JWT_REFRESH_EXPIRATION_TIME: number;
    JWT_REFRESH_SECRET: string;
    JWT_SECRET: string;
};

export const getEnv = <K extends keyof Environment>(
    key: K,
    fallback?: Environment[K]
): Environment[K] => {
    const value = process.env[key] as Environment[K] | undefined;

    if (value === undefined) {
        // handle fallback falsy cases that should still be used as value
        if (fallback === '' || fallback === 0) {
            return fallback;
        }
        if (fallback) {
            return fallback;
        }
        throw new Error(`Missing environment variable: ${key}.`);
    }

    return value;
};
