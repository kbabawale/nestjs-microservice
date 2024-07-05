import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import {
  DriverAgeRange,
  DriverGuarantor,
  DriverNextOfKin,
  DriverVehicleField,
  OTPField,
} from '../model/user.model';

export class DriverDTO {
  @ApiProperty({
    example: 'Driver A',
    description: "Driver's First Name",
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Driver B',
    description: "Driver's Last Name",
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'Driver Ventures',
    description: "Driver's Business Name",
  })
  @IsString()
  @IsOptional()
  businessName: string;

  @ApiProperty({
    example: 'Independent/Distributor',
    description: 'Driver Type',
  })
  @IsString()
  @IsNotEmpty()
  driverType: string;

  @ApiProperty({
    example: 'er34n5ienfri4r',
    description: 'ID of employer (A distributor)',
  })
  @IsString()
  @IsOptional()
  employer?: string;

  @ApiProperty({
    example: false,
    description: "Drivers's First Reset Password State",
  })
  @IsOptional()
  firstPasswordReset?: boolean;

  @ApiProperty({
    example: true,
    description: 'Driver is verified',
  })
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @ApiProperty({
    example: '1 Infinite loop, Lagos',
    description: "Driver's Address",
  })
  @IsString()
  @IsOptional()
  residentialAddress?: string;

  @ApiProperty({
    example: '2.1233, 2.123422',
    description: "Driver's Address Coordinates",
  })
  @IsString()
  @IsOptional()
  residentialAddressCoordinates?: string;

  @ApiProperty({
    example: 'driver@website.com',
    description: "Driver's Email",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Driver's Phone Number",
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: '343949339190',
    description: "Driver's NIN",
  })
  @IsString()
  @IsOptional()
  nin: string;

  @ApiProperty({
    example: 'Active',
    description: "Driver's Status",
  })
  status?: string;

  @ApiProperty({
    example: 'Password',
    description: "Driver's Password",
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: true,
    description: 'Whether to authenticate new user after account creation',
  })
  @IsOptional()
  authenticate?: boolean;

  @ApiProperty({
    example: true,
    description: "Driver's 2FA Status",
  })
  @IsOptional()
  twoFactorAuthentication?: boolean;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Driver's Profile Photo",
  })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;

  @ApiProperty({
    example: 'wefr/2345t',
    description: "Driver's Profile Photo Public ID (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoPublicID?: string;

  @ApiProperty({
    example: '234r8vn9er34rv',
    description: "Driver's Profile Photo Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoSignature?: string;

  @ApiProperty({
    example: '18-24',
    description:
      "Driver's Age Range -- '18-24', '25-34', '35-44', '45-54', 'Above 55'",
  })
  @IsString()
  @IsNotEmpty()
  ageRange: DriverAgeRange;

  @ApiProperty({
    example: 'Single',
    description: "Driver's Marital Status",
  })
  @IsString()
  @IsOptional()
  maritalStatus: string;

  @ApiProperty({
    example: {
      model: 'Toyota',
      make: 'Avalon',
      numberPlate: 'XYZ419',
      color: 'black',
    },
    description: "Driver's Vehicle",
  })
  @IsNotEmptyObject()
  @IsOptional()
  vehicle?: DriverVehicleField;

  @ApiProperty({
    example: 'https://www.aws.s3.com/file',
    description: "Driver's License",
  })
  @IsNotEmpty()
  @IsOptional()
  @IsUrl()
  driversLicense?: string;

  @ApiProperty({
    example: [
      {
        firstName: 'Guarantor A',
        lastName: 'Guarantor B',
        email: 'guarantor@driver.com',
        address: '1 Infinite Loop, Lagos',
        verified: true,
      },
      {
        firstName: 'Guarantor BA',
        lastName: 'Guarantor BB',
        email: 'guarantor2@driver.com',
        address: '2 Infinite Loop, Lagos',
        verified: false,
      },
    ],
    description: "Driver's Guarantors",
  })
  @IsNotEmpty()
  @IsOptional()
  guarantor?: DriverGuarantor[];

  @ApiProperty({
    example: {
      firstName: 'Guarantor A',
      lastName: 'Guarantor B',
      phone: '+234-8173919359',
      relationship: 'Brother',
      address: '1 Infinite Loop, Lagos',
      verified: true,
    },
    description: "Driver's Next of Kin",
  })
  @IsOptional()
  @IsNotEmptyObject()
  nextOfKin?: DriverNextOfKin;

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

export class UpdateDriverDTO {
  @ApiProperty({
    example: 'Driver A',
    description: "Driver's First Name",
  })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    example: 'Driver B',
    description: "Driver's Last Name",
  })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    example: 'Driver Ventures',
    description: "Driver's Business Name",
  })
  @IsString()
  @IsOptional()
  businessName?: string;

  @ApiProperty({
    example: false,
    description: "Driver's First Reset Password State",
  })
  @IsOptional()
  firstPasswordReset?: boolean;

  @ApiProperty({
    example: 'Independent/Distributor',
    description: 'Driver Type',
  })
  @IsString()
  @IsOptional()
  driverType?: string;

  @ApiProperty({
    example: true,
    description: 'Driver is verified',
  })
  @IsBoolean()
  @IsOptional()
  verified?: boolean;

  @ApiProperty({
    example: '1 Infinite loop, Lagos',
    description: "Driver's Address",
  })
  @IsString()
  @IsOptional()
  residentialAddress?: string;

  @ApiProperty({
    example: '2.1233, 2.123422',
    description: "Driver's Address Coordinates",
  })
  @IsString()
  @IsOptional()
  residentialAddressCoordinates?: string;

  @ApiProperty({
    example: 'er34n5ienfri4r',
    description: 'ID of employer (A distributor)',
  })
  @IsString()
  @IsOptional()
  employer?: string;

  @ApiProperty({
    example: 'driver@website.com',
    description: "Driver's Email",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Driver's Phone Number",
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: '343949339190',
    description: "Driver's NIN",
  })
  @IsString()
  @IsOptional()
  nin?: string;

  @ApiProperty({
    example: 'Active',
    description: "Driver's Status",
  })
  status?: string;

  @ApiProperty({
    example: 'Password',
    description: "Driver's Password",
  })
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: true,
    description: "Driver's 2FA Status",
  })
  @IsOptional()
  twoFactorAuthentication?: boolean;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Driver's Profile Photo",
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
    description: "Driver's Profile Photo Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoSignature?: string;

  @ApiProperty({
    example: 0,
    description:
      "Driver's Age Range -- '18-24', '25-34', '35-44', '45-54', 'Above 55'",
  })
  @IsString()
  @IsOptional()
  ageRange?: DriverAgeRange;

  @ApiProperty({
    example: 'Single',
    description: "Driver's Marital Status",
  })
  @IsString()
  @IsOptional()
  maritalStatus?: string;

  @ApiProperty({
    example: {
      model: 'Toyota',
      make: 'Avalon',
      numberPlate: 'XYZ419',
      color: 'black',
    },
    description: "Driver's Vehicle",
  })
  @IsNotEmptyObject()
  @IsOptional()
  vehicle?: DriverVehicleField;

  @ApiProperty({
    example: 'https://www.aws.s3.com/file',
    description: "Driver's License",
  })
  @IsOptional()
  @IsUrl()
  driversLicense?: string;

  @ApiProperty({
    example: 'wefr/2345t',
    description: "Distributor's License Public ID (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  driversLicensePublicID?: string;

  @ApiProperty({
    example: '234r8vn9er34rv',
    description: "Driver's License Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  driversLicenseSignature?: string;

  @ApiProperty({
    example: [
      {
        firstName: 'Guarantor A',
        lastName: 'Guarantor B',
        email: 'guarantor@driver.com',
        address: '1 Infinite Loop, Lagos',
        verified: true,
      },
      {
        firstName: 'Guarantor BA',
        lastName: 'Guarantor BB',
        email: 'guarantor2@driver.com',
        address: '2 Infinite Loop, Lagos',
        verified: false,
      },
    ],
    description: "Driver's Guarantors",
  })
  @IsOptional()
  guarantor?: DriverGuarantor[];

  @ApiProperty({
    example: {
      firstName: 'Guarantor A',
      lastName: 'Guarantor B',
      phone: '+234-8173919359',
      relationship: 'Brother',
      address: '1 Infinite Loop, Lagos',
      verified: true,
    },
    description: "Driver's Next of Kin",
  })
  @IsOptional()
  @IsNotEmptyObject()
  nextOfKin?: DriverNextOfKin;

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
