import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { IUserRepository } from '../domain/user.repository';
import {
    CreateUserDto,
    UpdateUserDto,
    UserResponseDto,
} from '../presentation/dto';

@Injectable()
export class UserAuthService {
    // depends on abstraction interfaces
    constructor(private readonly users: IUserRepository) {}

    /** Create a new user */
    async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
        // Check if user already exists
        const existing = await this.users.findByEmail(dto.email);
        if (existing) {
            throw new BadRequestException('Email already exists');
        }

        return await this.users.create(dto);
    }

    /** Find all users */
    async findAllUsers(): Promise<UserResponseDto[]> {
        return await this.users.findAll();
    }

    /** Find single user by id */
    async findUserById(id: string): Promise<UserResponseDto | null> {
        return await this.users.findById(id);
    }

    /** Find single user by email */
    async findUserByEmail(email: string): Promise<UserResponseDto | null> {
        return await this.users.findByEmail(email);
    }

    /** Update user profile */
    async updateUser(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
        return await this.users.update(id, dto);
    }

    /** Soft delete user (set deletedAt) */
    async removeUser(id: string): Promise<void> {
        return await this.users.softDelete(id);
    }
}
