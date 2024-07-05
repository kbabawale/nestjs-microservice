import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class GoogleCountriesDTO {
  @ApiProperty({ example: 'Nigeria', description: 'Country Name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'true or false', description: 'Country Name Status' })
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
