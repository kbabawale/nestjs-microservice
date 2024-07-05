import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CategoryDTO {
  @ApiProperty({
    example: 'Drinks & Beverages',
    description: 'Category Name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://images.com/image',
    description: 'Category Image',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
