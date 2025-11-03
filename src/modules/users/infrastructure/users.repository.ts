import { Injectable } from '@nestjs/common';
import {
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto,
} from '../presentation/dto';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/modules/common/services/prisma.service';
import { IUserRepository } from '../domain/user.repository';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private readonly database: PrismaService) {}

    async create(dto: CreateUserDto): Promise<UserResponseDto> {
        const record = await this.database.user.create({
            data: {
                email: dto.email,
                password: dto.password,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            },
        });

        return plainToInstance(UserResponseDto, record);
    }

    async findById(id: string): Promise<UserResponseDto | null> {
        const record = await this.database.user.findUnique({ where: { id } });
        return record ? plainToInstance(UserResponseDto, record) : null;
    }

    async findByEmail(email: string): Promise<UserResponseDto | null> {
        const record = await this.database.user.findUnique({
            where: { email },
        });
        return record ? plainToInstance(UserResponseDto, record) : null;
    }

    async findAll(): Promise<UserResponseDto[]> {
        const records = await this.database.user.findMany({
            where: { deletedAt: null },
        });
        return records.map(record => plainToInstance(UserResponseDto, record));
    }

    async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        const record = await this.database.user.update({
            where: { id },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                phoneNumber: dto.phoneNumber,
                updatedAt: new Date(),
            },
        });
        return plainToInstance(UserResponseDto, record);
    }

    async softDelete(id: string): Promise<void> {
        await this.database.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
