import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VehicleDTO {
  @ApiProperty({ example: 'Toyota', description: 'Vehicle Brand' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hilux', description: 'Vehicle Model' })
  model: string;
}
