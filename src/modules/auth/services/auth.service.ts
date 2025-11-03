import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/modules/common/services/hash.service';

import { UserAuthService } from 'src/modules/users/application/user.service';
import { AuthLoginDto } from '../dtos/auth.login.dto';
import { AuthResponseDto } from '../dtos/auth.response.dto';
import { AuthSignupDto } from '../dtos/auth.signup.dto';
import {
    IAuthPayload,
    ITokenResponse,
    TokenType,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExp: string;
    private readonly refreshTokenExp: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
        private readonly userAuthService: UserAuthService
    ) {
        this.accessTokenSecret =
            this.configService.get<string>('auth.accessToken.secret') ?? '';
        this.refreshTokenSecret =
            this.configService.get<string>('auth.refreshToken.secret') ?? '';
        this.accessTokenExp =
            this.configService.get<string>('auth.accessToken.expirationTime') ??
            '';
        this.refreshTokenExp =
            this.configService.get<string>(
                'auth.refreshToken.expirationTime'
            ) ?? '';
    }

    async verifyToken(accessToken: string): Promise<IAuthPayload> {
        return await this.jwtService.verifyAsync<IAuthPayload>(accessToken, {
            secret: this.accessTokenSecret,
        });
    }

    async generateTokens(user: IAuthPayload): Promise<ITokenResponse> {
        const [accessToken, refreshToken] = await Promise.all([
            // Assign token with id, role, and token type (access or refresh)
            this.jwtService.signAsync<any>(
                {
                    id: user.id,
                    role: user.role,
                    tokenType: TokenType.ACCESS_TOKEN,
                },
                {
                    secret: this.accessTokenSecret,
                    expiresIn: Number(this.accessTokenExp),
                }
            ),
            // Assign token with id, role, and token type (refresh)
            this.jwtService.signAsync(
                {
                    id: user.id,
                    role: user.role,
                    tokenType: TokenType.REFRESH_TOKEN,
                },
                {
                    secret: this.refreshTokenSecret,
                    expiresIn: Number(this.refreshTokenExp),
                }
            ),
        ]);

        return { accessToken, refreshToken };
    }

    async login(data: AuthLoginDto): Promise<AuthResponseDto> {
        const { email, password } = data;
        const user = await this.userAuthService.findByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = this.hashService.match(user.password, password);
        if (!isPasswordValid) {
            throw new NotFoundException('Invalid password');
        }

        const tokens = await this.generateTokens({
            id: user.id,
            role: user.role,
        });

        return { ...tokens, user };
    }

    async signup(data: AuthSignupDto): Promise<AuthResponseDto> {
        const { email, password } = data;
        const existingUser = await this.userAuthService.findByEmail(email);

        if (existingUser) {
            throw new ConflictException('User already exists with this email');
        }

        const hashedPassword = this.hashService.createHash(password);
        const createdUser = await this.userAuthService.create({
            email,
            password: hashedPassword,
        });

        if (!createdUser?.id || !createdUser?.role) {
            throw new Error('Failed to create user');
        }

        const tokens = await this.generateTokens({
            id: createdUser.id,
            role: createdUser.role,
        });

        return { ...tokens, user: createdUser };
    }
}
