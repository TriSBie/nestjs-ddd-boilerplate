import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './shared/local-auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SwaggerResponse } from 'src/lib/response/api-response.dto';
import { AuthResponseDto } from './dtos/auth.response.dto';
import { AuthUser } from './decorators/auth-user.decorator';
import { UserEntity } from '../users/domain/user.entity';

@ApiTags('auth.public')
@Controller('auth')
export class AuthController {
    constructor() { }

    @ApiOperation({
        summary: 'User login',
        description: 'Authenticate user with email and password',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully authenticated',
        type: SwaggerResponse(AuthResponseDto),
    })
    @UseGuards(LocalAuthGuard)
    @Post()
    async login(@AuthUser() user: UserEntity) {
        return user;
    }


    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
    }
}
