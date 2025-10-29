import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { UserService } from '../application/user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../presentation/dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiCreatedResponse({ type: UserResponseDto })
    async create(@Body() dto: CreateUserDto) {
        const user = await this.userService.create(dto);
        return user; // mapped to DTO via service or mapper
    }

    @Get(':id')
    @ApiOkResponse({ type: UserResponseDto })
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Put(':id')
    @ApiOkResponse({ type: UserResponseDto })
    async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(id, dto);
    }
}
