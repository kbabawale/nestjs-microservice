import { ResponseFormat } from '../../../../libs/common/src/util/response';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BankDTO } from '../dto/bank.dto';
import { Bank } from '../schemas/bank.schema';
import { BankService } from '../service/bank.service';

@ApiTags('Bank')
@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  @ApiOperation({ summary: 'Adds new bank' })
  async add(@Body() request: BankDTO): Promise<ResponseFormat<Bank>> {
    let bank: Bank = await this.bankService.create(request);
    let banksCount: number = await this.bankService.countDocuments();

    let obj: ResponseFormat<Bank> = {
      message: 'Bank Added',
      data: bank,
      meta: {
        count: banksCount,
      },
    };
    return obj;
  }

  @Get()
  @ApiOperation({ summary: 'Fetches bank list' })
  async get() {
    let list = await this.bankService.get();
    let obj: ResponseFormat<any> = {
      message: 'Bank List',
      data: list,
    };
    return obj;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a bank' })
  async deleteOne(@Param('id') id: string): Promise<ResponseFormat<boolean>> {
    let deleted = await this.bankService.delete({ _id: id });

    let obj: ResponseFormat<boolean> = {
      message: `Bank Deleted`,
      data: true,
    };
    return obj;
  }
}
