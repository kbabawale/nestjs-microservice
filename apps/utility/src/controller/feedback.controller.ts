import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FeedbackDTO } from '../dto/feedback.dto';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: 'Adds new feedback' })
  async add(@Body() request: FeedbackDTO) {}

  @Get()
  @ApiOperation({ summary: 'Fetches feedback based on various criteria' })
  @ApiQuery({
    name: 'user',
    type: String,
    required: false,
  })
  //   based on time, user, paginated,
  async getFeedback(@Query('user') user: string) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a feedback' })
  async deleteOne(@Param('id') id: string) {}
}
