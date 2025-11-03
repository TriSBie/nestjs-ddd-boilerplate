import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { AppLoggerMiddleware } from './middleware/app.logger.middleware';
import { JsonBodyMiddleware } from './middleware/json.body.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './modules/common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, load: [configuration], expandVariables: true,
    }),
    CommonModule,
    UsersModule,
    AuthModule
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