import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { AppLoggerMiddleware } from './middleware/app.logger.middleware';
import { JsonBodyMiddleware } from './middleware/json.body.middleware';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, load: [configuration], expandVariables: true,
    }),
    PrismaModule,
    UsersModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JsonBodyMiddleware)
      .forRoutes('*');
    consumer
      .apply(AppLoggerMiddleware)
      .forRoutes('*');
  }
}