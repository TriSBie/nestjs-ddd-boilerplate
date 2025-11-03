import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Role } from 'prismaGenerated/prisma';

export class UserResponseDto {
    @ApiProperty({ example: 'uuid-1234' })
    id: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: 'John' })
    firstName?: string;

    @ApiProperty({ example: 'Doe' })
    lastName?: string;

    @ApiProperty({ example: 'https://cdn.app/avatar.jpg' })
    avatar?: string;

    @ApiProperty({ example: true })
    isVerified: boolean;

    @ApiProperty({ example: '+84123456789' })
    phoneNumber?: string;

    @ApiProperty({ enum: Role })
    role: Role;

    @ApiProperty({ example: '2025-10-29T00:00:00Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-10-29T00:00:00Z' })
    updatedAt: Date;

    @Exclude()
    password: string;
}
