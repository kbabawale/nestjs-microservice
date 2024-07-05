import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { DriverVehicleField } from '../model/user.model';

export class StaffDTO {
  @ApiProperty({ example: 'sdf345tgf345f', description: "Staff's Employer" })
  @IsString()
  @IsNotEmpty()
  distributorID: string;

  @ApiProperty({ example: 'Staff A', description: "Staff's First Name" })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Staff B', description: "Staff's Last Name" })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Courier', description: "Staff's Duty" })
  @IsString()
  @IsNotEmpty()
  userType: string;

  @ApiProperty({
    example: 'staff@website.com',
    description: "Staff's Email",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: true,
    description: 'Whether to authenticate new user after account creation',
  })
  @IsOptional()
  authenticate?: boolean;

  @ApiProperty({
    example: '+2348173919359',
    description: "Staff's Phone Number",
  })
  @IsPhoneNumber('NG')
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'password',
    description: "Staff's Password",
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
    description: "Staff's Status",
  })
  status?: string;

  accessToken?: string;
  refreshToken?: string;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Staff's Profile Photo",
  })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;

  @ApiProperty({
    example: 'wefr/2345t',
    description: "Staff's Profile Photo Public ID (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoPublicID?: string;

  @ApiProperty({
    example: '234r8vn9er34rv',
    description: "Staff's Profile Photo Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoSignature?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Device Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  fcmToken?: string;

  @ApiProperty({
    example: {
      model: 'Hiace',
      make: 'Toyota',
      numberPlate: '232344XYS',
      color: 'white',
      id: '2345543234',
    },
    description: "Staff's Assigned Vehicle",
  })
  @IsOptional()
  assignedVehicle?: DriverVehicleField;
}

export class UpdateStaffDTO {
  @ApiProperty({ example: 'sdf345tgf345f', description: "Staff's Employer" })
  @IsString()
  @IsOptional()
  distributorID?: string;

  @ApiProperty({ example: 'Staff A', description: "Staff's First Name" })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Staff B', description: "Staff's Last Name" })
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'Courier', description: "Staff's Duty" })
  @IsString()
  @IsOptional()
  userType?: string;

  @ApiProperty({
    example: true,
    description: 'Whether to authenticate new user after account creation',
  })
  @IsOptional()
  authenticate?: boolean;

  @ApiProperty({
    example: 'staff@website.com',
    description: "Staff's Email",
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: '+2348173919359',
    description: "Staff's Phone Number",
  })
  @IsPhoneNumber('NG')
  @IsOptional()
  phone?: string;

  @ApiProperty({
    example: 'password',
    description: "Staff's Password",
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
    description: "Staff's Status",
  })
  status?: string;

  accessToken?: string;
  refreshToken?: string;

  @ApiProperty({
    example: 'https://www.aws.s3.com/photo',
    description: "Staff's Profile Photo",
  })
  @IsOptional()
  @IsUrl()
  profilePhoto?: string;

  @ApiProperty({
    example: 'wefr/2345t',
    description: "Staff's Profile Photo Public ID (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoPublicID?: string;

  @ApiProperty({
    example: '234r8vn9er34rv',
    description: "Staff's Profile Photo Signature (Cloudinary)",
  })
  @IsOptional()
  @IsString()
  profilePhotoSignature?: string;

  @ApiProperty({
    example: '394rn93enfrb8er3vh838bdf',
    description: 'Device Token',
  })
  @IsOptional({ message: 'Token is invalid' })
  fcmToken?: string;

  @ApiProperty({
    example: {
      model: 'Hiace',
      make: 'Toyota',
      numberPlate: '232344XYS',
      color: 'white',
      id: '2345543234',
    },
    description: "Staff's Assigned Vehicle",
  })
  @IsOptional()
  assignedVehicle?: DriverVehicleField;
}
