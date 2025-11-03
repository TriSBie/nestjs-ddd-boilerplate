import { CreateUserDto, UserResponseDto } from '../presentation/dto';
import { UpdateUserDto } from '../presentation/dto/update-user.dto';

export interface IUserRepository {
    create(dto: CreateUserDto): Promise<UserResponseDto>;
    findById(id: string): Promise<UserResponseDto | null>;
    findByEmail(email: string): Promise<UserResponseDto | null>;
    findAll(): Promise<UserResponseDto[]>;
    update(id: string, dto: UpdateUserDto): Promise<UserResponseDto>;
    softDelete(id: string): Promise<void>;
}
