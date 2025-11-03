import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { AuthJwtAccessGuard } from './guards/jwt.access.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthJwtAccessStrategy } from './providers/jwt.access.strategy';
import { AuthJwtRefreshStrategy } from './providers/jwt.refresh.strategy';
import { HashService } from './services/hash.service';
import { PrismaService } from './services/prisma.service';
import { QueryBuilderService } from './services/query-builder.service';

@Module({
  imports: [
    // CacheModule.registerAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const ttl = configService.get<number>('redis.ttl') * 1000;
    //     const redisUrl = configService.get<string>('redis.url');
    //     return {
    //       stores: [
    //         new Keyv({
    //           store: new CacheableMemory({
    //             ttl,
    //             lruSize: 5000, // least recently used items are removed
    //           }),
    //         }),
    //         createKeyv(redisUrl),
    //       ],
    //     };
    //   },
    //   isGlobal: true, // make the cache module available globally
    // }),
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: false, // Passport module is used to authenticate the user
    }),
  ],
  providers: [
    PrismaService,
    HashService,
    QueryBuilderService,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
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
    PrismaService,
    HashService,
    QueryBuilderService,
    AuthJwtAccessStrategy,
    AuthJwtRefreshStrategy,
  ],
})
export class CommonModule { }
