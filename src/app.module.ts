import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { AppLoggerMiddleware } from './middleware/app.logger.middleware';
import { JsonBodyMiddleware } from './middleware/json.body.middleware';
import { appConfig } from './config/app';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { CommonModule } from './modules/common/common.module';

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            expandVariables: true,
        }),
        // UsersModule,
        // AuthModule
        CommonModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: SentryGlobalFilter,
        },
    ],
    controllers: [AppController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(JsonBodyMiddleware).forRoutes('*');
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
