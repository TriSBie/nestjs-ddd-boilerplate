import { UserResponseDto } from '../presentation/dto';
import { User } from './user.entity';

export interface IUserRepository {
    create(user: User): Promise<UserResponseDto>;
    findById(id: string): Promise<UserResponseDto | null>;
    findByEmail(email: string): Promise<UserResponseDto | null>;
    findAll(): Promise<UserResponseDto[]>;
    update(user: User): Promise<UserResponseDto>;
    softDelete(id: string): Promise<void>;
}
