import { ApiProperty } from '@nestjs/swagger';

export class ResponseFormat<T, M = {}> {
  @ApiProperty({ description: 'Response Message', example: '' })
  message: string;

  @ApiProperty({ description: 'Response Data' })
  data: T;

  @ApiProperty({ description: 'Fringe Data' })
  meta?: M;
}

export interface VonageSMSResponseFormat {
  messages: {
    to: string; //phone number
    'message-id': string;
    status: string;
    'remaining-balance': string;
    'message-price': string;
    network: string;
  }[];
  'message-count': string;
}
