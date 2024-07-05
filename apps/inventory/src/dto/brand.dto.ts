import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class BrandDTO {
  @ApiProperty({
    example: 'Coca-Cola',
    description: 'Brand Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://images.com/image',
    description: 'Brand Image',
  })
  @IsString()
  @IsNotEmpty()
  logo: string;

  @ApiProperty({
    example: 'Nigeria',
    description: 'Brand Country',
  })
  @IsString()
  @IsNotEmpty()
  country: string;
}
