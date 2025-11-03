import { Module } from "@nestjs/common";
import { UserService } from "./application/user.service";
import { UserController } from "./presentation/user.controller";
import { UserPrismaRepository } from "./infrastructure/prisma/users.repository";


@Module({
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'IUserRepository',
            useClass: UserPrismaRepository
        }
    ],
    exports: [UserService],
})
export class UsersModule { }
