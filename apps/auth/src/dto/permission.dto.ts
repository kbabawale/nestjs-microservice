import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class PermissionDTO {
  @ApiProperty({
    example: 'Manage Access Control',
    description: "Roles' Persmissions",
  })
  @IsString()
  name: string;
}
