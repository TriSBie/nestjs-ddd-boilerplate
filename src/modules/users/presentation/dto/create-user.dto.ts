import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'prismaGenerated/prisma';

export class CreateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123' })
  @IsString()
  password: string;

  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false, example: 'https://cdn.app/avatar.jpg' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ required: false, example: '+84123456789' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiProperty({ enum: Role, default: Role.USER })
  @IsEnum(Role)
  role?: Role;
}

