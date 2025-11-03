import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UserEntity } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../presentation/dto';

@Injectable()
export class UserService {
  // depends on abstraction interfaces
  constructor(private readonly users: IUserRepository) { }

  /** Create a new user */
  async create(dto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user already exists
    const existing = await this.users.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Domain entity creation
    const user = new UserEntity()

    const saved = await this.users.create(user);
    return saved;
  }

  /** Find all users */
  async findAll(): Promise<UserResponseDto[]> {
    const result = await this.users.findAll();
    return result.map(user => user);
  }

  /** Find single user by id */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Find single user by email */
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  /** Update user profile */
  async update(id: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException('User not found');

    // Update domain properties
    const updated = new UserEntity(

    );

    const saved = await this.users.update(updated);
    return saved;
  }

  /** Soft delete user (set deletedAt) */
  async remove(id: string): Promise<void> {
    const user = await this.users.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.users.softDelete(id);
  }
}
