import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/lib/response/api-response.dto';
import { AuthJwtRefreshGuard } from 'src/modules/common/guards/jwt.refresh.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { AuthLoginDto } from '../dtos/auth.login.dto';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/auth.response.dto';
import { AuthSignupDto } from '../dtos/auth.signup.dto';
import { IAuthPayload } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('auth.public')
@Controller('auth')
export class AuthPublicController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: 'User login',
        description: 'Authenticate user with email and password',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully authenticated',
        type: SwaggerResponse(AuthResponseDto),
    })
    @Post('login')
    async login(@Body() loginDto: AuthLoginDto) {
        return this.authService.login(loginDto);
    }

    @ApiOperation({
        summary: 'User registration',
        description: 'Create a new user account',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully created and authenticated',
        type: SwaggerResponse(AuthResponseDto),
    })
    @Post('signup')
    async signup(@Body() signupDto: AuthSignupDto) {
        return this.authService.signup(signupDto);
    }

    // UseGuards decorator is used to apply the AuthJwtRefreshGuard guard to the route
    @UseGuards(AuthJwtRefreshGuard)
    @Get('refresh')
    @ApiOperation({
        summary: 'Refresh tokens',
        description:
            'Generate new access and refresh tokens using refresh token',
    })
    @ApiResponse({
        status: 200,
        description: 'Tokens successfully refreshed',
        type: SwaggerResponse(AuthRefreshResponseDto),
    })
    refreshTokens(
        @AuthUser() user: IAuthPayload
    ): Promise<AuthRefreshResponseDto> {
        return this.authService.generateTokens(user);
    }
}
