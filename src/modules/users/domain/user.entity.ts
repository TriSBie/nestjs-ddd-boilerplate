import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { Role, User } from "prismaGenerated/prisma";
import { Exclude } from "class-transformer";

export class UserEntity implements User {
  @ApiProperty({ description: 'The ID of the user' })
  id: string;
  @ApiProperty({ description: 'The email of the user' })
  email: string;

  @ApiProperty({ description: 'The first name of the user' })
  firstName: string;
  @ApiProperty({ description: 'The last name of the user' })
  lastName: string;
  @ApiProperty({ description: 'The avatar of the user' })
  avatar: string;
  isVerified: boolean;
  @ApiProperty({ description: 'The phone number of the user' })
  phoneNumber: string;
  @ApiProperty({ description: 'The role of the user' })
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
