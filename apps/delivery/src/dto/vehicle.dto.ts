import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { AccompanyingDocumentField } from '../model/delivery.model';

export class VehicleDTO {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Hiace' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  notes: string;

  @ApiProperty({ example: '34rtgfd234r5tgfd' })
  @IsString()
  @IsNotEmpty()
  distributorID: string;

  @ApiProperty({ example: '2020' })
  @IsString()
  @IsNotEmpty()
  year: string;

  @ApiProperty({ example: '3rtgf2345543454' })
  @IsString()
  @IsOptional()
  VIN: string;

  @ApiProperty({ example: '3rtgf2345543454' })
  @IsString()
  @IsOptional()
  registration: string;

  @ApiProperty({ example: '3rtgf2345543454' })
  @IsString()
  @IsNotEmpty()
  numberPlate: string;

  @ApiProperty({ example: 'White' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    example: ['https://images.com/image1', 'https://images.com/image2'],
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: [
      {
        name: 'Vehicle License',
        fileURL: 'https://images.com/image1',
        filePublicID: '2345rfvcsdf',
        fileSignature: 'dfkjfj34j3',
        issueDate: new Date(),
        expiryDate: new Date(),
      },
    ],
  })
  @IsArray()
  @IsOptional()
  accompanyingDocuments?: AccompanyingDocumentField[];
}

export class UpdateVehicleDTO {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsOptional()
  make?: string;

  @ApiProperty({ example: 'Hiace' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: '34rtgfd234r5tgfd' })
  @IsString()
  @IsOptional()
  distributorID?: string;

  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: '2020' })
  @IsString()
  @IsOptional()
  year?: string;

  @ApiProperty({ example: '3rtgf2345543454' })
  @IsString()
  @IsOptional()
  VIN?: string;

  @ApiProperty({ example: '3rtgf2345543454' })
  @IsString()
  @IsOptional()
  registration?: string;

  @ApiProperty({ example: '3rtgf2345543454' })
  @IsString()
  @IsOptional()
  numberPlate?: string;

  @ApiProperty({ example: 'White' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  visible?: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    example: ['https://images.com/image1', 'https://images.com/image2'],
  })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({
    example: [
      {
        name: 'Vehicle License',
        fileURL: 'https://images.com/image1',
        filePublicID: '2345rfvcsdf',
        fileSignature: 'dfkjfj34j3',
        issueDate: new Date(),
        expiryDate: new Date(),
      },
    ],
  })
  @IsArray()
  @IsOptional()
  accompanyingDocuments?: AccompanyingDocumentField[];
}
