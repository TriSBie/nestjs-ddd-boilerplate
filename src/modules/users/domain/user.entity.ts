import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Role, User } from "prismaGenerated/prisma";
import { Exclude, Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsString } from "class-validator";

export class UserEntity implements User {
  @ApiProperty({ description: 'The ID of the user' })
  id: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'The first name of the user' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'The last name of the user' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'The avatar of the user' })
  @IsString()
  avatar: string;

  @ApiProperty({ description: 'The is verified of the user' })
  @IsBoolean()
  isVerified: boolean;

  @ApiProperty({ description: 'The phone number of the user' })
  @IsString()
  phoneNumber: string;
  @ApiProperty({ description: 'The role of the user' })

  @IsEnum(Role)
  @Transform(({ value }) => value.toUpperCase())
  role: Role;

  @ApiProperty({ description: 'The created at date of the user' })
  createdAt: Date;
  @ApiProperty({ description: 'The updated at date of the user' })
  updatedAt: Date;
  @ApiProperty({ description: 'The deleted at date of the user' })
  deletedAt: Date | null;

  @Exclude()
  @ApiHideProperty()
  password: string;
}
