import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export interface OTPField {
  password: string;
  created_at: string;
}
export interface SavedInventoryField {
  inventory_id: string;
}

export interface DriverVehicleField {
  model: string;
  make: string;
  numberPlate: string;
  color: string;
  id?: string;
}

export interface DriverGuarantor {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  verified: boolean;
}

export interface DriverNextOfKin {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
  address: string;
  verified: boolean;
}

export interface BankAccount {
  bankName: string;
  accountNumber: number;
  accountName: string;
}

export enum DriverAgeRange {
  '18-24' = '18-24',
  '25-34' = '25-34',
  '35-44' = '35-44',
  '45-54' = '45-54',
  'Above 55' = 'Above 55',
}

export enum RequestsType {
  'UPDATEEMAIL' = 'UPDATEEMAIL',
  'UPDATERETAILERDETAILS' = 'UPDATERETAILERDETAILS',
  'UPDATEDRIVERDETAILS' = 'UPDATEDRIVERDETAILS',
  'VERIFYDRIVER' = 'VERIFYDRIVER',
}

export interface RequestEmailPayload {
  newEmail?: string;
  userId?: string;
}
export interface RequestVerifyDriverPayload {
  userId: string;
}
export interface RequestRetailerPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  storeAddress?: string;
  storeAddressCoordinates?: string;
  userId: string;
}

export interface RolesPermission {
  name: string;
}

export interface TokenObj {
  access_token: string;
  refresh_token: string;
}
export class LoginObj {
  @ApiProperty({ example: '+2348173919359' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: '+2348173919359' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'StrongPassword' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'Retailer',
    description: 'Retailer, Driver, Distributor, Admin',
  })
  @IsString()
  @IsNotEmpty()
  platform: string;
}
export class WishListDTO {
  @ApiProperty({ example: 'dfijgnu348rfbdsfds' })
  userid: string;

  @ApiProperty({ example: 'efkjgu345rtbrnsdii9' })
  inventoryID?: string;
}
export interface VerifyDriver {
  verified: boolean;
}

export class VerifyOTP {
  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: '+2348173919359' })
  @IsString()
  @IsNotEmpty()
  phone: string;
}

export class VerifyEmailOTP {
  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({ example: 'k@d.com' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class SendOTPNIN {
  @ApiProperty({ example: 1394879234 })
  nin: string;
}
export class SendOTP {
  @ApiProperty({ example: +2348173919359 })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'aaa@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsOptional()
  platform?: string;
}
export class ForgotPasswordPhone {
  @ApiProperty({ example: +2348173919359 })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;
}

export class ForgotPasswordEmail {
  @ApiProperty({ example: 'a@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;
}

export enum EmailType {
  SENDOTP = 'SENDOTP',
  GENERAL = 'GENERAL',
}

export class SendEmail {
  @ApiProperty({ example: 'aaa@email.com' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Hello' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: { name: 'Peter' } })
  @IsObject()
  @IsOptional()
  data?: any;

  @ApiProperty({ example: 'SENDOTP' })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class SetNewPassword {
  @ApiProperty({ example: 'StrongPassword' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({ example: 'wer43232435gtewew' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
export class NewPassword {
  @ApiProperty({ example: 'StrongPassword' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({ example: 'wer43232435gtewew' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
export class GenNewPassword {
  @ApiProperty({ example: 'StrongPassword' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class PushNotificationField {
  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({ example: 'wer43232435gtewew' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ example: 'New Alert' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class RegenerateToken {
  @ApiProperty({ example: 'Q234deo345fnnm0034' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;
}

export class ChangePassword {
  @ApiProperty({ example: 'StrongPassword' })
  newPassword: string;

  @ApiProperty({ example: 'StrongPassword' })
  oldPassword?: string;
}

export class LogoutObj {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InR5cGUiOiJ...',
  })
  @IsString()
  @IsNotEmpty()
  refreshtoken: string;

  @ApiProperty({ example: 'Retailer' })
  @IsString()
  @IsNotEmpty()
  platform: string;

  @ApiProperty({ example: 'User ID' })
  @IsString()
  @IsNotEmpty()
  id: string;
}
