import { CreateUserDto, UserResponseDto } from '../presentation/dto';

export interface IUserRepository {
    create(user: CreateUserDto): Promise<UserResponseDto>;
    findById(id: string): Promise<UserResponseDto | null>;
    findByEmail(email: string): Promise<UserResponseDto | null>;
    findAll(): Promise<UserResponseDto[]>;
    update(user: UpdateUserDto): Promise<UserResponseDto>;
    softDelete(id: string): Promise<void>;
}
