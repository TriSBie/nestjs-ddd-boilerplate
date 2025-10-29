import { Module } from "@nestjs/common";
import { UserController } from "./controller/user.controller";
import { UserService } from "./application/user.service";
import { UserPrismaRepository } from "./infrastructure/repositories/users.repository";


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
