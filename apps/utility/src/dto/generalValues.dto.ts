import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GeneralValuesDTO {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({})
  value: number;
}

export class CloudinaryDelete {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty()
  public_id: string;
}
