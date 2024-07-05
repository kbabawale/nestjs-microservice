import { validatePhoneNumber } from '../../../../libs/common/src/util/formatPhone';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  UseFilters,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as mongoose from 'mongoose';
// import { Cache as RedisCache } from 'cache-manager';
import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { DriverDTO, UpdateDriverDTO } from '../dto/driver.dto';
import { Driver } from '../schemas/driver.schema';
import { DriverService } from '../service/driver.service';
import { VerifyDriver } from '../model/user.model';
import { PushNotificationService } from '../../../../libs/common/src/util/PushNotification/pushNotification';
import { PaginatedResponse } from 'libs/common/src/util/util';

@Controller('auth/driver')
export class DriverController {
  constructor(
    private readonly driverService: DriverService,
    private readonly pNotiService: PushNotificationService,
    // @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  @ApiTags('Driver')
  @Post('')
  @ApiOperation({ summary: 'Registers A Driver' })
  async addDriver(@Body() request: DriverDTO): Promise<ResponseFormat<Driver>> {
    //set default password if none is provided
    let defaultPassword: string =
      request.hasOwnProperty('password') === false
        ? this.driverService.generateRandomPassword(5, 3, 2)
        : request.password;
    request = { ...request, password: defaultPassword };

    //prevent duplicate entries
    let duplicateFound = await this.driverService.get({
      $or: [{ email: request.email }, { phone: request.phone }],
    });

    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Driver already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    //validate and add new driver
    let validPhone: boolean = validatePhoneNumber(request.phone);
    if (!validPhone) {
      throw new HttpException(
        {
          data: {},
          meta: {},
          message: 'Phone is invalid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let hashedPassword = await this.driverService.hashPassword(
      request.password,
    );
    request = { ...request, password: hashedPassword };

    let driver = await this.driverService.create(request, {});

    if (!driver) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          message: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    let obj: ResponseFormat<any>;

    if (
      request.hasOwnProperty('authenticate') &&
      request.authenticate === true
    ) {
      let payload = {
        type: request.driverType,
        email: request.email,
        sub: driver._id,
      };

      let accesstoken = await this.driverService.generateJWT(payload);
      let refreshtoken = await this.driverService.generateJWT(payload, '1y');

      let tokenObj = {
        access_token: accesstoken,
        refresh_token: refreshtoken,
      };

      // update user profile with refresh token
      let res = await this.driverService.update(
        { _id: driver._id },
        { refreshToken: tokenObj.refresh_token, lastLoginTime: new Date() },
      );
      if (!res) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
            },
            message: res,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      obj = {
        message: 'Driver registered',
        data: driver,
        meta: {
          authToken: tokenObj,
        },
      };
    } else {
      obj = {
        message: 'Driver registered',
        data: driver,
        meta: {},
      };
    }

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Driver')
  @Put(':id')
  @ApiOperation({ summary: 'Updates A Driver' })
  async updateDriver(
    @Param('id') id: string,
    @Body() request: UpdateDriverDTO,
  ): Promise<ResponseFormat<Driver>> {
    //fetch record
    let recordFound = await this.driverService.get({ _id: id });

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

    //validate and update driver
    if (request.phone) {
      let validPhone: boolean = validatePhoneNumber(request.phone);
      if (!validPhone) {
        throw new HttpException(
          {
            data: {},
            meta: {},
            message: 'Phone is invalid',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    //update db
    let driver = await this.driverService.update({ _id: id }, request);

    let obj: ResponseFormat<Driver> = {
      message: 'Driver updated',
      data: driver,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Driver')
  @Put('verify/:id')
  @ApiOperation({
    summary:
      'Verifies A Driver after successful onboarding, and alerts driver by push notification',
  })
  async verifyDriver(
    @Param('id') id: string,
    @Body() request: VerifyDriver,
  ): Promise<ResponseFormat<Driver>> {
    //fetch record
    let recordFound = await this.driverService.get({ _id: id });

    if (recordFound.length == 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: `Record (${id}) not found`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //update db
    if (!recordFound[0].fcmToken) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'Driver Cannot Receive Notifications',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let driver = await this.driverService.update({ _id: id }, request);
    //send push notification
    this.pNotiService.send({
      body: 'You are now a verified driver on Storedash',
      title: 'Driver Verification',
      token: recordFound[0].fcmToken,
    });

    let obj: ResponseFormat<any> = {
      message: 'Driver Verified',
      data: '',
      meta: {},
    };
    return obj;
  }

  @ApiTags('Driver')
  @Get('/search')
  @ApiOperation({ summary: 'Search driver' })
  @ApiQuery({
    name: 'name',
    type: String,
    description:
      'Search by first name, last name, business name, email, phone number, fcm token, id',
    required: false,
  })
  async getUser(
    @Query('name') name: string,
  ): Promise<ResponseFormat<PaginatedResponse<Driver[]>>> {
    //list accounts

    let fetchRes: Driver[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let res: PaginatedResponse<Driver[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    fetchRes = await this.driverService.get({
      status: 'Active',
      $or: [
        // { _id: new RegExp(name, 'i') },
        { firstName: new RegExp(name, 'i') },
        { lastName: new RegExp(name, 'i') },
        { businessName: new RegExp(name, 'i') },
        { email: new RegExp(name, 'i') },
        { phone: new RegExp(name, 'i') },
        { fcmToken: new RegExp(name, 'i') },
      ],
    });

    if (fetchRes.length > 0)
      fetchCount = await this.driverService.countDocuments({
        status: 'Active',
        $or: [
          // { _id: new RegExp(name, 'i') },
          { firstName: new RegExp(name, 'i') },
          { lastName: new RegExp(name, 'i') },
          { businessName: new RegExp(name, 'i') },
          { email: new RegExp(name, 'i') },
          { phone: new RegExp(name, 'i') },
          { fcmToken: new RegExp(name, 'i') },
        ],
      });

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Drivers Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Driver')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes A Driver' })
  async deleteDriver(
    @Param('id') id: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.driverService.update(
      { _id: id },
      { visible: false },
    );

    let obj: ResponseFormat<any> = {
      message: 'Driver Deleted',
      data: '',
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Driver')
  @Delete('/email/:email')
  @ApiOperation({ summary: 'Deletes A Driver By Email' })
  async deleteDriverByEmail(
    @Param('email') email: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.driverService.update(
      { email },
      { visible: false },
    );

    let obj: ResponseFormat<any> = {
      message: 'Driver Deleted',
      data: '',
      meta: {},
    };
    return obj;
  }
}
