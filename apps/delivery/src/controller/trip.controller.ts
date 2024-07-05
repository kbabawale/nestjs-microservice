import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { PushNotificationService } from '../../../../libs/common/src/util/PushNotification/pushNotification';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
import { PaginatedResponse } from '../../../../libs/common/src/util/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { OrderDTO } from '../dto/order.dto';
import { TripDTO } from '../dto/trip.dto';
import { TripStatus } from '../model/delivery.model';
import { Trip } from '../schemas/trip.schema';
import { OrderService } from '../service/order.service';
import { TripService } from '../service/trip.service';

@Controller('delivery')
export class TripController {
  constructor(
    private readonly tripService: TripService,
    private readonly orderService: OrderService,
    private readonly pNotiService: PushNotificationService,
    @Inject(ConfigService) public config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Trip')
  @Post('trip')
  @ApiOperation({ summary: 'Create a trip' })
  async createTrip(@Body() request: TripDTO): Promise<ResponseFormat<Trip>> {
    if (request.status) {
      let status = Object.values(TripStatus).includes(
        request.status as TripStatus,
      );
      if (!status) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.NOT_ACCEPTABLE,
            },
            message: 'Provide a valid Status',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    let tripCreated = await this.tripService.create(request);

    if (!tripCreated) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: tripCreated,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<any> = {
      message: 'Trip Created',
      data: tripCreated,
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Trip')
  @Get('trip')
  @ApiOperation({ summary: 'Fetch trip(s)' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'orderID',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'dispatchOperatorID',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'distributorID',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    description: 'HEADING_TO_PICKUP|HEADING_TO_DROPOFF',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Default=10',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    type: String,
    required: false,
  })
  async getTrip(
    @Query('id') id: string,
    @Query('orderID') orderID: string,
    @Query('distributorID') distributorID: string,
    @Query('dispatchOperatorID') dispatchOperatorID: string,
    @Query('status') status: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
  ): Promise<ResponseFormat<PaginatedResponse<Trip[]>>> {
    //list requests
    let fetchRes: Trip[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let lInt = limit ? Number(limit) : 0;
    let skipInt = skip ? Number(skip) : 0;

    let res: PaginatedResponse<Trip[]> = {
      data: [],
      limit: lInt,
      skip: skipInt,
      total: fetchCount,
    };

    let query: FilterQuery<Trip> = {};

    if (status) query.status = new RegExp(status, 'i');
    if (dispatchOperatorID) query['dispatchOperator.id'] = dispatchOperatorID;
    if (distributorID) query['order.distributorID'] = distributorID;
    if (orderID) query['order.orderID'] = orderID;

    if (id) {
      fetchRes = await this.tripService.get({ _id: id }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.tripService.countDocuments({ _id: id });
    } else {
      fetchRes = await this.tripService.get({ ...query }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.tripService.countDocuments({ ...query });
    }

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Trip(s) Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Trip')
  @Get('trip/search')
  @ApiOperation({ summary: 'Search trip(s)' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'distributorID',
    type: String,
    required: false,
  })
  async searchTrips(
    @Query('name') name: string,
    @Query('distributorID') distributorID: string,
  ): Promise<ResponseFormat<PaginatedResponse<Trip[]>>> {
    let fetchRes: Trip[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let res: PaginatedResponse<Trip[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    ///search through name, category, manufacturer names
    fetchRes = await this.tripService.get({
      'order.distributorID': distributorID,
      $or: [
        { status: new RegExp(name, 'i') },
        { 'order.orderID': new RegExp(name, 'i') },
        { 'dispatchOperator.fullname': new RegExp(name, 'i') },
        { 'pickUpPin.pin': new RegExp(name, 'i') },
      ],
    });
    if (fetchRes.length > 0)
      fetchCount = await this.tripService.countDocuments({
        'order.distributorID': distributorID,
        $or: [
          { status: new RegExp(name, 'i') },
          { 'order.orderID': new RegExp(name, 'i') },
          { 'dispatchOperator.fullname': new RegExp(name, 'i') },
          { 'pickUpPin.pin': new RegExp(name, 'i') },
        ],
      });

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Requests Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Trip')
  @ApiOperation({ summary: 'Updates A Trip' })
  @Put('trip/:id')
  async updateTrip(
    @Param('id') id: string,
    @Body() request: TripDTO,
  ): Promise<ResponseFormat<Trip>> {
    //fetch record
    let recordFound = await this.tripService.get({ _id: id });

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

    //validate and update db
    if (request.status) {
      let statusValidation = Object.values(TripStatus).includes(
        request.status as TripStatus,
      );
      if (!statusValidation) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.NOT_ACCEPTABLE,
            },
            message: 'Provide a valid Status',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    let updated = await this.tripService.update({ _id: id }, request);

    if (updated) {
    if (request.status === TripStatus.HEADING_TO_DROPOFF) {
      //fetch retailer's fcm token using orderID
      
      
      //send push notification
      this.pNotiService.send({
        body: 'Dispatch Operator is enroute your store',
        title: 'Delivery Update',
        token: ''//fcmToken,
      });
    }}
        

    let obj: ResponseFormat<Trip> = {
      message: 'Trip updated',
      data: updated,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Trip')
  @ApiOperation({ summary: 'Deletes An Trip' })
  @Delete('trip/:id')
  async deleteTrip(@Param('id') id: string): Promise<ResponseFormat<boolean>> {
    let trip = await this.tripService.get({ _id: id });

    if (trip && trip.length > 0) {
      if (trip[0].status !== TripStatus.COMPLETE) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.BAD_REQUEST,
            },
            message: 'Cannot delete a trip in transit',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    let deleted = await this.tripService.delete({ _id: id });

    let obj: ResponseFormat<boolean> = {
      message: 'Trip Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Track Trip')
  @Get('trip/track')
  @ApiOperation({ summary: "Tracks driver's location real-time" })
  @ApiQuery({
    name: 'order',
    type: String,
    required: true,
  })
  async getDriverLocation(@Query('order') order: string) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Trip')
  @Get('trip/rate')
  @ApiOperation({
    summary: 'Calculate rate of trip',
  })
  @ApiQuery({
    name: 'order',
    type: String,
    required: true,
  })
  async calculateTripRate(@Query('order') order: string) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Track Trip')
  @Post('trip/track')
  @ApiOperation({ summary: "Posts most recent driver's location" })
  async postDriverLocation(@Body() request: OrderDTO) {}
}
