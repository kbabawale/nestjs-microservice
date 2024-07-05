import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject } from 'class-validator';
import {
  DispatchOperatorField,
  TripOrderField,
  TripPinField,
} from '../model/delivery.model';

export class TripDTO {
  @ApiProperty({
    example: 'HEADING_TO_PICKUP|HEADING_TO_DROPOFF',
    description: 'Trip Status',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: {
      fullname: 'Peter Smith',
      profileImage: 'https://images.cloudinary.com/image',
      phone: '+23482478348833',
      id: '23rfnn34ff834nr9s09',
      type: 'Independent',
      vehicle: {
        model: 'Camry',
        make: 'Toyota',
        numberPlate: 'ABS 239 ASX',
        color: 'Black',
      },
    },
    description: 'Dispatch Operators Details',
  })
  @IsObject()
  @IsOptional()
  dispatchOperator?: DispatchOperatorField;

  @ApiProperty({
    example: {
      orderID: '3432454',
      distributorID: '34fdfghgtr34',
    },
    description: 'Order Details',
  })
  @IsObject()
  @IsOptional()
  order?: TripOrderField;

  @ApiProperty({
    example: {
      pin: 4422,
      confirmed: true,
    },
    description: 'Pick Up Pin Details/Status',
  })
  @IsObject()
  @IsOptional()
  pickUpPin?: TripPinField;

  @ApiProperty({
    example: {
      pin: 4422,
      confirmed: true,
    },
    description: 'Drop Off Pin Details/Status',
  })
  @IsObject()
  @IsOptional()
  dropOffPin?: TripPinField;
}
