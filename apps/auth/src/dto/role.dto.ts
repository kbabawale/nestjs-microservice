import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { RolesPermission } from '../model/user.model';

export class RoleDTO {
  @ApiProperty({ example: 'Role A', description: 'Role Name' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'A good role for masters',
    description: 'Role Description',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: [
      {
        name: 'Authentication',
      },
      {
        name: 'Inventory',
      },
      {
        name: 'Delivery',
      },
    ],
    description: "Roles' Persmissions",
  })
  @IsArray()
  @IsOptional()
  privileges?: RolesPermission[];
}
