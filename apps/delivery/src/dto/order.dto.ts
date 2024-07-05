import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsArray,
} from 'class-validator';
import {
  CostBreakDownField,
  DispatchOperatorField,
  ItemsField,
  OrderPaymentField,
} from '../model/delivery.model';

export class OrderDTO {
  @ApiProperty({ example: 'ORDER_CREATED', description: 'Order Status' })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: {
      status: true,
      meansOfPayment: 'DEBITCARD',
    },
    description: 'Payment Status',
  })
  @IsObject()
  @IsOptional()
  payment?: OrderPaymentField;

  @ApiProperty({
    example: {
      fullname: 'Peter Smith',
      profileImage: 'https://images.cloudinary.com/image',
      phone: '+23482478348833',
      id: '23rfnn34ff834nr9s09',
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
    example: [
      {
        name: 'Coca-Cola Can 1L',
        id: '29djjf9993nss',
        price: 20.5,
        quantity: 3,
      },
    ],
    description: 'Items Ordered / Purchased',
  })
  @IsArray()
  @IsOptional()
  items?: ItemsField[];

  @ApiProperty({
    example: {
      items: 45.5,
      booking: 2.5,
      delivery: 2.0,
      tax: 0.4,
    },
    description: 'Cost breakdown',
  })
  @IsObject()
  @IsOptional()
  costBreakdown?: CostBreakDownField;
}
