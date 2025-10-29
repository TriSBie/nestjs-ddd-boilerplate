import { join } from 'path';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';

import configs from './config';
import { ResponseInterceptor } from './interceptors/response.interceptor';
import { DatabaseService } from './services/database.service';
import { ResponseExceptionFilter } from './filters/exception.filter';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configs, // load the config modules
      isGlobal: true, // make the config module available globally
      cache: true, // cache the config module
      envFilePath: ['.env.docker', '.env'], // load the environment variables from the .env.docker and .env files
      expandVariables: true, // expand the environment variables
      validationSchema: Joi.object({
        // App Configuration
        NODE_ENV: Joi.string()
          .valid('development', 'staging', 'production', 'local')
          .default('development'),
        APP_NAME: Joi.string().default('NestJS Auth Service'),
        APP_DEBUG: Joi.boolean().truthy('true').falsy('false').default(false),

        // CORS Configuration
        APP_CORS_ORIGINS: Joi.string().default('http://localhost:3000'),

        // HTTP Configuration
        HTTP_ENABLE: Joi.boolean().truthy('true').falsy('false').default(true),
        HTTP_HOST: Joi.string().default('0.0.0.0'),
        HTTP_PORT: Joi.number().port().default(9001),
        HTTP_VERSIONING_ENABLE: Joi.boolean().truthy('true').falsy('false').default(false),
        HTTP_VERSION: Joi.number().valid(1, 2).default(1),

        // Monitoring
        SENTRY_DSN: Joi.string().allow('').optional(),

        // Database Configuration
        DATABASE_URL: Joi.string().uri().required(),

        // JWT Configuration
        ACCESS_TOKEN_SECRET_KEY: Joi.string().min(32).required(),
        ACCESS_TOKEN_EXPIRED: Joi.string().default('15m'),
        REFRESH_TOKEN_SECRET_KEY: Joi.string().min(32).required(),
        REFRESH_TOKEN_EXPIRED: Joi.string().default('7d'),

        // Redis Configuration
        REDIS_URL: Joi.string().uri().default('redis://localhost:6379'),
        REDIS_KEY_PREFIX: Joi.string().default('auth:'),
        REDIS_TTL: Joi.number().default(3600),

        // GRPC Configuration
        GRPC_URL: Joi.string().required(),
        GRPC_PACKAGE: Joi.string().default('auth'),
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const ttl = configService.get<number>('redis.ttl') * 1000;
        const redisUrl = configService.get<string>('redis.url');
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl,
                lruSize: 5000, // least recently used items are removed
              }),
            }),
            createKeyv(redisUrl),
          ],
        };
      },
      isGlobal: true, // make the cache module available globally
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false, // Passport module is used to authenticate the user
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en', // fallback language if the language is not supported
      loaderOptions: {
        path: join(__dirname, '../languages/'),
        watch: process.env.NODE_ENV === 'development', // watch the languages files for changes
      },
      // resolvers are used to resolve the language - we use the QueryResolver.
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver], // QueryResolver is used to resolve the language from the query parameter
    }),
  ],
  providers: [
    // Core Services
    DatabaseService,
    HashService,
    QueryBuilderService,

    // JWT Strategies
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,

    // Global Interceptors
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

    // Global Exception Filters
    {
      provide: APP_FILTER,
      useClass: ResponseExceptionFilter,
    },

    // Global Guards (order matters)
    {
      provide: APP_GUARD,
      useClass: AuthJwtAccessGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [
    DatabaseService,
    HashService,
    QueryBuilderService,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
