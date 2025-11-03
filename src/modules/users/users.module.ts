import { Module } from '@nestjs/common';
import { UserController } from './presentation/user.controller';
import { UserPrismaRepository } from './infrastructure/users.repository';
import { UserAuthService } from './application/user.service';

@Module({
    controllers: [UserController],
    providers: [
        UserAuthService,
        {
            provide: 'IUserRepository',
            useClass: UserPrismaRepository,
        },
    ],
    exports: [UserAuthService],
})
export class UsersModule {}
