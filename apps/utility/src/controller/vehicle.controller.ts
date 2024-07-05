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

@ApiTags('Vehicle')
@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  @ApiOperation({ summary: 'Adds new vehicle' })
  async add(@Body() request: VehicleDTO): Promise<ResponseFormat<Vehicle>> {
    let v: Vehicle = await this.vehicleService.create(request);
    let vCount: number = await this.vehicleService.countDocuments();

    let obj: ResponseFormat<any> = {
      message: 'Vehicle Added',
      data: v,
      meta: {
        count: vCount,
      },
    };
    return obj;
  }

  @Get()
  @ApiOperation({ summary: 'Fetches vehicle list' })
  async get(): Promise<ResponseFormat<Vehicle[]>> {
    let list = await this.vehicleService.get({});
    let obj: ResponseFormat<any> = {
      message: 'Vehicle List',
      data: list,
    };
    return obj;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Updates a vehicle' })
  async update(
    @Param('id') id: string,
    @Body() request: Partial<VehicleDTO>,
  ): Promise<ResponseFormat<Vehicle>> {
    let v: Vehicle = await this.vehicleService.update({ _id: id }, request);

    let obj: ResponseFormat<any> = {
      message: 'Vehicle Updated',
      data: v,
    };
    return obj;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes a vehicle' })
  async deleteOne(@Param('id') id: string): Promise<ResponseFormat<Vehicle>> {
    let deleted = await this.vehicleService.delete({ _id: id });

    let obj: ResponseFormat<any> = {
      message: `Vehicle Deleted`,
      data: {},
    };
    return obj;
  }
}
