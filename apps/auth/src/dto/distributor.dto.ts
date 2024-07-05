import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { OTPField } from '../model/user.model';

export class DistributorDTO {
  @ApiProperty({
    example: 'Distributor A',
    description: "Distributor's First Name",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Distributor B',
    description: "Distributor's Last Name",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'Distributor Ventures',
    description: "Distributor's Business Name",
  })
  @IsString()
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({
    example: '1 Infinite loop, Lagos',
    description: "Distributor's Address",
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '6.451171957010042, 3.6121256825017345',
    description: "Distributor's Address Coordinates",
  })
  @IsString()
  @IsOptional()
  addressCoordinates?: string;

  @ApiProperty({
    example: 'distributor@website.com',
    description: "Distributor's Email",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Distributor's Phone Number",
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'gf87tbkjj',
    description: "Distributor's Password",
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Distributor's Profile Photo",
  })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;

  @ApiProperty({
    example: 'wefr/2345t',
    description: "Distributor's Profile Photo Public ID (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoPublicID?: string;

  @ApiProperty({
    example: '234r8vn9er34rv',
    description: "Distributor's Profile Photo Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoSignature?: string;

  @ApiProperty({
    example: false,
    description: "Distributor's First Reset Password State",
  })
  @IsOptional()
  firstPasswordReset?: boolean;

  @ApiProperty({
    example: true,
    description: "Distributor's 2FA Switch",
  })
  @IsOptional()
  twoFactorAuthentication?: boolean;

  @ApiProperty({
    example: 'Active/Blocked',
    description: "Distributor's Status",
  })
  @IsOptional()
  status?: string;

  accessToken?: string;

  refreshToken?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Device Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  fcmToken?: string;

  @ApiProperty({
    example: 10,
    description:
      'Specify stock level when system notifies you of low inventory',
  })
  @IsOptional()
  lowStockAlert?: number;

  @ApiProperty({
    example: 10,
    description: 'INDEPENDENT_DRIVER_ONLY,DISTRIBUTOR_DRIVER_ONLY,RANDOM_MIX',
  })
  @IsOptional()
  @IsString()
  dispatchOperatorPreference?: string;

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

export class UpdateDistributorDTO {
  @ApiProperty({
    example: 'Distributor A',
    description: "Distributor's First Name",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Distributor B',
    description: "Distributor's Last Name",
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'Distributor Ventures',
    description: "Distributor's Business Name",
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    example: '1 Infinite loop, Lagos',
    description: "Distributor's Address",
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    example: '6.451171957010042, 3.6121256825017345',
    description: "Distributor's Address Coordinates",
  })
  @IsString()
  @IsOptional()
  addressCoordinates?: string;

  @ApiProperty({
    example: 'distributor@website.com',
    description: "Distributor's Email",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Distributor's Phone Number",
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'gf87tbkjj',
    description: "Distributor's Password",
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: false,
    description: "Distributor's First Reset Password State",
  })
  @IsOptional()
  firstPasswordReset?: boolean;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Distributor's Profile Photo",
  })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;

  @ApiProperty({
    example: 'wefr/2345t',
    description: "Distributor's Profile Photo Public ID (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoPublicID?: string;

  @ApiProperty({
    example: '234r8vn9er34rv',
    description: "Distributor's Profile Photo Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoSignature?: string;

  @ApiProperty({
    example: true,
    description: "Distributor's 2FA Switch",
  })
  @IsOptional()
  twoFactorAuthentication?: boolean;

  @ApiProperty({
    example: 'Active/Blocked',
    description: "Distributor's Status",
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Access Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  accessToken?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Refresh Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  refreshToken?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Device Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  fcmToken?: string;

  @ApiProperty({
    example: 10,
    description:
      'Specify stock level when system notifies you of low inventory',
  })
  @IsOptional()
  lowStockAlert?: number;

  @ApiProperty({
    example: 10,
    description: 'DISTRIBUTOR_DRIVER or INDEPENDENT_DRIVER',
  })
  @IsOptional()
  @IsString()
  dispatchOperatorPreference?: string;

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
