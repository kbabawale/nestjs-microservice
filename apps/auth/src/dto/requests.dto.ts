import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RequestsType } from '../model/user.model';

export class RequestsDTO {
  @ApiProperty({
    example: 'UPDATEEMAIL',
    description: 'Request Type',
  })
  @IsString()
  @IsNotEmpty()
  type: RequestsType;

  @ApiProperty({
    example: { newEmail: '', userId: '' },
    description: 'Associating payload depending on type',
  })
  @IsOptional()
  payload?: any;

  @ApiProperty({
    example: 'Pending',
    description: 'Request Status',
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'Peter Smith',
    description: 'Admin who approved Request',
  })
  @IsOptional()
  approvedBy?: string;

  @ApiProperty({
    example: '2022-10-22T10:00:00Z',
    description: 'Date of approval',
  })
  @IsOptional()
  approvalDate?: Date;
}

export class UpdateRequestsDTO {
  @ApiProperty({
    example: 'UPDATEEMAIL',
    description: 'Request Type',
  })
  @IsOptional()
  type?: RequestsType;

  @ApiProperty({
    example: { newEmail: '', userId: '' },
    description: 'Associating payload depending on type',
  })
  @IsOptional()
  payload?: any;

  @ApiProperty({
    example: 'Pending',
    description: 'Request Status',
  })
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'Peter Smith',
    description: 'Admin who approved Request',
  })
  @IsOptional()
  approvedBy?: string;

  @ApiProperty({
    example: '2022-10-22T10:00:00Z',
    description: 'Date of approval',
  })
  @IsOptional()
  approvalDate?: Date;
}
