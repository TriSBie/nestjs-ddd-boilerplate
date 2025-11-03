import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/modules/users/application/user.service';
import { UserEntity } from 'src/modules/users/domain/user.entity';
import { AuthSignupDto } from '../dtos/auth.signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) { }

    async validateUser(
        userEmail: string,
        userPassword: string
    ): Promise<any> {
        const user = await this.userService.findByEmail(userEmail);
        if (user && user.password === userPassword) {
            return user;
        }
    }

    async signUp(signUpDto: AuthSignupDto): Promise<Partial<UserEntity>> {
        const { email, password } = signUpDto;

        const existingUser = await this.userService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException('User already exists with this email');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userService.create(signUpDto);
        return user;
    }
}
