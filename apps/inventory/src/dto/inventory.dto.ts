import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsArray,
  IsNumber,
  IsPositive,
  IsDecimal,
} from 'class-validator';
import {
  DistributorField,
  ManufacturerField,
  PriceField,
} from '../model/inventory.model';

export class InventoryDTO {
  @ApiProperty({
    example: 'Coca-Cola 1L Can',
    description: 'Can carbonated drink',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Drinks & Beverages',
    description: 'Product Category',
  })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    example: [
      'https://images.cloudinary.com/image',
      'https://images.cloudinary.com/image',
    ],
    description: 'Product Image(s)',
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({
    example: {
      currentPrice: 1000,
      sale: true,
      saleRate: 5,
    },
    description: 'Product Price',
  })
  @IsNotEmpty()
  @IsObject()
  price: PriceField;

  @ApiProperty({ example: '3', description: 'Product Shelf Count' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  stockCount: number;

  @ApiProperty({ example: 'AD33BU81Q', description: 'Product SKU' })
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    example: {
      name: 'Coca-Cola Industries',
      country: 'USA',
      logo: 'https://images.cloudinary.com/image',
    },
    description: 'Product Manufacturer',
  })
  @IsOptional()
  @IsObject()
  manufacturer?: ManufacturerField;

  @ApiProperty({
    example: {
      id: 'wefgfds',
      name: 'Coca-Cola Industries',
      profilePhoto: 'https://images.cloudinary.com/image',
      address: 'Lekki',
      addressCoordinates: '1232.44, 34993.23',
    },
    description: 'Supplier',
  })
  @IsObject()
  @IsNotEmpty()
  distributor: DistributorField;

  @ApiProperty({ example: 0, description: 'Product Weight in KG' })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  weight: number;

  @ApiProperty({
    example: '23AX9JNQ',
    description: 'Product NAFDAC Registration Number',
  })
  @IsString()
  @IsOptional()
  nafdacRegistration?: string;

  @ApiProperty({
    example: 'A lovely and enjoyable product',
    description: 'Product Description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class AltInventoryDTO {
  @ApiProperty({
    example: 'Coca-Cola 1L Can',
    description: 'Can carbonated drink',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Drinks & Beverages',
    description: 'Product Category',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: [
      'https://images.cloudinary.com/image',
      'https://images.cloudinary.com/image',
    ],
    description: 'Product Image(s)',
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiProperty({
    example: {
      currentPrice: 1000,
      sale: true,
      saleRate: 5,
    },
    description: 'Product Price',
  })
  @IsOptional()
  @IsObject()
  price?: PriceField;

  @ApiProperty({ example: '3', description: 'Product Shelf Count' })
  @IsNumber()
  // @IsPositive()
  @IsOptional()
  stockCount?: number;

  @ApiProperty({ example: 'AD33BU81Q', description: 'Product SKU' })
  @IsOptional()
  SKU?: string;

  @ApiProperty({
    example: {
      name: 'Coca-Cola Industries',
      country: 'USA',
      logo: 'https://images.cloudinary.com/image',
    },
    description: 'Product Manufacturer',
  })
  @IsOptional()
  @IsObject()
  manufacturer?: ManufacturerField;

  @ApiProperty({
    example: {
      name: '7Up Distribution Company',
      id: 'm23n4r9h9348',
      profilePhoto: 'https://images.cloudinary.com/image',
    },
    description: 'Product Distributor',
  })
  @IsOptional()
  @IsObject()
  distributor?: DistributorField;

  @ApiProperty({ example: 0, description: 'Product Weight in KG' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  weight?: number;

  @ApiProperty({
    example: '23AX9JNQ',
    description: 'Product NAFDAC Registration Number',
  })
  @IsString()
  @IsOptional()
  nafdacRegistration?: string;

  @ApiProperty({
    example: 'A lovely and enjoyable product',
    description: 'Product Description',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
