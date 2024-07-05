import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class FeedbackDTO {
  @ApiProperty({ example: 'Hello', description: 'Feedback' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '234584234843', description: 'User ID' })
  user: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Distributor', description: 'User Type' })
  usertype: string;
}
