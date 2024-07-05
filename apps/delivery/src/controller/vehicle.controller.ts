import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
import { PaginatedResponse } from '../../../../libs/common/src/util/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { boolean } from 'joi';
import { FilterQuery } from 'mongoose';
import { UpdateVehicleDTO, VehicleDTO } from '../dto/vehicle.dto';
import { Vehicle } from '../schemas/vehicle.schema';
import { VehicleService } from '../service/vehicle.service';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Vehicle')
  @Post('')
  @ApiOperation({ summary: 'Registers A Vehicle Belonging to a Distributor' })
  async addVehicle(
    @Body() request: VehicleDTO,
  ): Promise<ResponseFormat<Vehicle>> {
    //prevent duplicate entries
    let duplicateFound = await this.vehicleService.get({
      $and: [
        { make: request.make },
        { model: request.model },
        { distributorID: request.distributorID },
      ],
    });

    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Vehicle already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    let newVehicle = await this.vehicleService.create(request);

    if (!newVehicle) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: newVehicle,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<Vehicle> = {
      message: 'Vehicle Saved',
      data: newVehicle,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Vehicle')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes A Vehicle' })
  async deleteVehicle(
    @Param('id') id: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.vehicleService.update(
      { _id: id },
      { visible: false },
    );

    let obj: ResponseFormat<boolean> = {
      message: 'Vehicle Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Vehicle')
  @Put(':id')
  @ApiOperation({ summary: 'Updates A Vehicle' })
  async updateVehicle(
    @Param('id') id: string,
    @Body() request: UpdateVehicleDTO,
  ): Promise<ResponseFormat<Vehicle>> {
    //fetch record
    let recordFound = await this.vehicleService.get({ _id: id });

    if (recordFound.length == 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'Record not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //update db
    let vehicle = await this.vehicleService.update({ _id: id }, request);

    let obj: ResponseFormat<Vehicle> = {
      message: 'Vehicle updated',
      data: vehicle,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Vehicle')
  @Get('')
  @ApiOperation({ summary: 'List of Vehicles' })
  @ApiQuery({
    name: 'published',
    type: boolean,
    required: false,
  })
  @ApiQuery({
    name: 'make',
    type: String,
    description: 'Toyota',
    required: false,
  })
  @ApiQuery({
    name: 'registration',
    type: String,
    description: '2345gfderhgfd',
    required: false,
  })
  @ApiQuery({
    name: 'VIN',
    type: String,
    description: 'Tdfhgfd35432',
    required: false,
  })
  @ApiQuery({
    name: 'model',
    type: String,
    description: 'Hiace',
    required: false,
  })
  @ApiQuery({
    name: 'distributorID',
    type: String,
    description: 'Owner ID',
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
  })
  async getUser(
    @Query('published') published: boolean,
    @Query('make') make: string,
    @Query('model') model: string,
    @Query('registration') registration: string,
    @Query('VIN') VIN: string,
    @Query('distributorID') distributorID: string,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ): Promise<ResponseFormat<PaginatedResponse<any>>> {
    //list vehicles

    let fetchRes: Vehicle[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let lInt = limit ? Number(limit) : 0;
    let skipInt = skip ? Number(skip) : 0;

    let res: PaginatedResponse<Vehicle[]> = {
      data: [],
      limit: lInt,
      skip: skipInt,
      total: fetchCount,
    };

    let query: FilterQuery<Vehicle> = {};

    if (model) query.model = new RegExp(model, 'i');
    if (make) query.make = new RegExp(make, 'i');
    if (distributorID) query.distributorID = new RegExp(distributorID, 'i');
    if (registration) query.registration = new RegExp(registration, 'i');
    if (VIN) query.VIN = new RegExp(VIN, 'i');
    if (published) query.published = published;
    if (published) query.published = query.published === 'true';

    if (distributorID) {
      fetchRes = await this.vehicleService.get(
        { distributorID: distributorID },
        skipInt,
        lInt,
      );
      if (fetchRes.length > 0)
        fetchCount = await this.vehicleService.countDocuments({
          distributorID,
        });
    } else {
      fetchRes = await this.vehicleService.get({ ...query }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.vehicleService.countDocuments({ ...query });
    }

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Requests Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }
}
