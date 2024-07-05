import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { OTPField } from '../model/user.model';

export class AdminDTO {
  @ApiProperty({ example: 'Admin A', description: "Admin's First Name" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Admin B', description: "Admin's Last Name" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'admin@website.com',
    description: "Admin's Email",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Admin's Phone Number",
  })
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'password',
    description: "Admin's Password",
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: true,
    description: '2FA Switch',
  })
  @IsOptional()
  twoFactorAuthentication?: boolean;

  @ApiProperty({
    example: 'Active',
    description: "Admin's Status",
  })
  status?: string;

  accessToken?: string;
  refreshToken?: string;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Admin's Profile Photo",
  })
  @IsOptional()
  @IsFQDN()
  profilePhoto?: string;

  @ApiProperty({
    example: 'Super Admin',
    description: "Admin's role and privileges",
  })
  @IsOptional()
  role?: string;

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

export class UpdateAdminDTO {
  @ApiProperty({ example: 'Admin A', description: "Admin's First Name" })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: 'Admin B', description: "Admin's Last Name" })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'admin@website.com',
    description: "Admin's Email",
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Admin's Phone Number",
  })
  @IsPhoneNumber('NG')
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: 'password',
    description: "Admin's Password",
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: true,
    description: '2FA Switch',
  })
  @IsOptional()
  twoFactorAuthentication?: boolean;

  @ApiProperty({
    example: 'Active',
    description: "Admin's Status",
  })
  @IsOptional()
  status?: string;

  accessToken?: string;
  refreshToken?: string;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Admin's Profile Photo",
  })
  @IsOptional()
  @IsFQDN()
  profilePhoto?: string;

  @ApiProperty({
    example: 'Super Admin',
    description: "Admin's role and privileges",
  })
  @IsOptional()
  role?: string;

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
