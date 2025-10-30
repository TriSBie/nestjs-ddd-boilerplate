import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/user.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { User } from '../../domain/user.entity';
import { UserResponseDto } from '../../presentation/dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(user: User): Promise<UserResponseDto> {
        const record = await this.prisma.user.create({
            data: user.toSafeObject(),
        });

        return plainToInstance(UserResponseDto, record);
    }

    async findById(id: string): Promise<UserResponseDto | null> {
        const record = await this.prisma.user.findUnique({ where: { id } });
        return record ? plainToInstance(UserResponseDto, record) : null;
    }

    async findByEmail(email: string): Promise<UserResponseDto | null> {
        const record = await this.prisma.user.findUnique({ where: { email } });
        return record ? plainToInstance(UserResponseDto, record) : null;
    }

    async findAll(): Promise<UserResponseDto[]> {
        const records = await this.prisma.user.findMany({
            where: { deletedAt: null },
        });
        return records.map(record => plainToInstance(UserResponseDto, record));
    }

    async update(user: User): Promise<UserResponseDto> {
        const record = await this.prisma.user.update({
            where: { id: user.id },
            data: user.toSafeObject(),
        });
        return plainToInstance(UserResponseDto, record);
    }

    async softDelete(id: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}
