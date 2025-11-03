import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto';
import { UserAuthService } from '../application/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserAuthService) {}

    @Post()
    @ApiCreatedResponse({ type: UserResponseDto })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.userService.createUser(dto);
        return user; // mapped to DTO via service or mapper
    }

    @Get(':id')
    @ApiOkResponse({ type: UserResponseDto })
    async findOne(@Param('id') id: string) {
        return this.userService.findUserById(id);
    }

    @Get('email/:email')
    @ApiOkResponse({ type: UserResponseDto })
    async findByEmail(@Param('email') email: string) {
        return this.userService.findUserByEmail(email);
    }

    @Get()
    @ApiOkResponse({ type: [UserResponseDto] })
    async findAll() {
        return this.userService.findAllUsers();
    }

    @Put(':id')
    @ApiOkResponse({ type: UserResponseDto })
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.updateUser(id, dto);
    }
}
