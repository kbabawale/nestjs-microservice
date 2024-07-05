import { ResponseFormat } from '../../../../libs/common/src/util/response';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VehicleDTO } from '../dto/vehicle.dto';
import { Vehicle } from '../schemas/vehicle.schema';
import { VehicleService } from '../service/vehicle.service';
import { GCService } from '../service/googleCountries.service';
import { GoogleCountriesDTO } from '../dto/googleCountries.dto';
import { GoogleCountries } from '../schemas/googleCountries.schema';

@ApiTags('Google')
@Controller('google/countries')
export class GoogleCountriesController {
  constructor(private readonly gcService: GCService) {}

  @Post()
  @ApiOperation({ summary: 'Adds new country' })
  async add(
    @Body() request: GoogleCountriesDTO,
  ): Promise<ResponseFormat<GoogleCountries>> {
    let v: GoogleCountries = await this.gcService.create(request);
    let vCount: number = await this.gcService.countDocuments();

    let obj: ResponseFormat<any> = {
      message: 'Country Added',
      data: v,
      meta: {
        count: vCount,
      },
    };
    return obj;
  }

  @Get()
  @ApiOperation({ summary: 'Fetches country list' })
  async get(): Promise<ResponseFormat<GoogleCountries[]>> {
    let list = await this.gcService.get({});
    let obj: ResponseFormat<any> = {
      message: 'Country List',
      data: list,
    };
    return obj;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a country listing' })
  async update(
    @Param('id') id: string,
    @Body() request: GoogleCountriesDTO,
  ): Promise<ResponseFormat<GoogleCountries>> {
    let v: GoogleCountries = await this.gcService.update({ _id: id }, request);

    let obj: ResponseFormat<any> = {
      message: 'Country Updated',
      data: v,
    };
    return obj;
  }
}
