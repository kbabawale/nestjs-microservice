import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { OTPField } from '../model/user.model';

export class RetailerDTO {
  @ApiProperty({ example: 'Retailer A', description: "Retailer's First Name" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Retailer B', description: "Retailer's Last Name" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'Retailer Ventures',
    description: "Retailer's Business Name",
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    example: '1 Infinite loop, Lagos',
    description: "Retailer's Address",
  })
  @IsString()
  @IsOptional()
  storeAddress?: string;

  @ApiProperty({
    example: '6.451171957010042, 3.6121256825017345',
    description: "Retailer's Address Coordinates",
  })
  @IsString()
  @IsOptional()
  storeAddressCoordinates?: string;

  @ApiProperty({
    example: 'XPassword123%',
    description: "Retailer's Password",
  })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'retailer@website.com',
    description: "Retailer's Email",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Retailer's Phone Number from any region with area code",
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'Active/Blocked',
    description: "Retailer's Status",
  })
  @IsOptional({ message: 'Status is invalid' })
  status: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Device Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  fcmToken?: string;

  @ApiProperty({
    example: {
      password: '2342',
      created_at: '2022-02-30T22343.22',
    },
  })
  @IsNotEmptyObject()
  @IsOptional({ message: 'OTP is invalid' })
  otp?: OTPField;
}

export class UpdateRetailerDTO {
  @ApiProperty({ example: 'Retailer A', description: "Retailer's First Name" })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Retailer B', description: "Retailer's Last Name" })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'Retailer Ventures',
    description: "Retailer's Business Name",
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    example: '1 Infinite loop, Lagos',
    description: "Retailer's Address",
  })
  @IsString()
  @IsOptional()
  storeAddress?: string;

  @ApiProperty({
    example: '6.451171957010042, 3.6121256825017345',
    description: "Retailer's Address Coordinates",
  })
  @IsString()
  @IsOptional()
  storeAddressCoordinates?: string;

  @ApiProperty({
    example: 'retailer@website.com',
    description: "Retailer's Email",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Retailer's Phone Number from any region with area code",
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'Active/Blocked',
    description: "Retailer's Status",
  })
  @IsOptional({ message: 'Status is invalid' })
  status?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Device Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  fcmToken?: string;

  @ApiProperty({ example: 'efkjgu345rtbrnsdii9' })
  wishList?: string;

  @ApiProperty({
    example: {
      password: '2342',
      created_at: '2022-02-30T22343.22',
    },
  })
  @IsNotEmptyObject()
  @IsOptional({ message: 'OTP is invalid' })
  otp?: OTPField;
}
