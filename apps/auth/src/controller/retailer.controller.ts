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
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { RetailerService } from '../service/retailer.service';
// import { Cache as RedisCache } from 'cache-manager';
import { RetailerDTO, UpdateRetailerDTO } from '../dto/retailer.dto';
import { Retailer } from '../schemas/retailer.schema';
import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { SavedInventoryField, WishListDTO } from '../model/user.model';
import { PaginatedResponse } from 'libs/common/src/util/util';
import { FilterQuery } from 'mongoose';

@Controller('auth/retailer')
export class RetailerController {
  constructor(
    private readonly retailerService: RetailerService,
    // @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}
  /**
   * Registers A Retailer
   * @return Saves info in DB
   */
  @ApiTags('Retailer')
  @Post('')
  @ApiOperation({ summary: 'Registers A Retailer' })
  async addRetailer(
    @Body() request: RetailerDTO,
  ): Promise<ResponseFormat<Retailer>> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();
    // try {
    //prevent duplicate entries
    let duplicateFound = await this.retailerService.get({
      $or: [{ email: request.email }, { phone: request.phone }],
    });

    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Retailer already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    //validate and add new retailer
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

    let hashedPassword = await this.retailerService.hashPassword(
      request.password,
    );
    request = { ...request, password: hashedPassword };

    let retailer = await this.retailerService.create(request, {
      session: transactionSession,
    });

    if (!retailer) {
      await transactionSession.abortTransaction();
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: retailer,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let payload = {
      type: 'Retailer',
      email: request.phone,
      sub: retailer._id,
    };

    let accesstoken = await this.retailerService.generateJWT(payload);
    let refreshtoken = await this.retailerService.generateJWT(payload, '1y');

    let tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

    // update user profile with refresh token
    let res = await this.retailerService.update(
      { _id: retailer._id },
      { refreshToken: tokenObj.refresh_token, lastLoginTime: new Date() },
      { session: transactionSession },
    );
    if (!res) {
      await transactionSession.abortTransaction();
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

    await transactionSession.commitTransaction();

    let obj: ResponseFormat<any> = {
      message: 'Retailer registered',
      data: retailer,
      meta: {
        authToken: tokenObj,
      },
    };
    transactionSession.endSession();
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Retailer')
  @Put(':id')
  @ApiOperation({ summary: 'Updates A Retailer' })
  async updateRetailer(
    @Param('id') id: string,
    @Body() request: UpdateRetailerDTO,
  ): Promise<ResponseFormat<Retailer>> {
    //fetch record
    let recordFound = await this.retailerService.get({ _id: id });

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

    //validate and update retailer
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
    let retailer = await this.retailerService.update({ _id: id }, request);

    let obj: ResponseFormat<any> = {
      message: 'Retailer updated',
      data: retailer,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Retailer')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes A Retailer' })
  async deleteRetailer(
    @Param('id') id: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.retailerService.update(
      { _id: id },
      { visible: false },
    );

    let obj: ResponseFormat<boolean> = {
      message: 'Retailer Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Retailer')
  @Get('/search')
  @ApiOperation({ summary: 'Search retailer' })
  @ApiQuery({
    name: 'name',
    type: String,
    description:
      'Search by first name, last name, business name, email, phone number, fcm token, id',
    required: false,
  })
  async getUser(
    @Query('name') name: string,
  ): Promise<ResponseFormat<PaginatedResponse<Retailer[]>>> {
    //list accounts

    let fetchRes: Retailer[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let res: PaginatedResponse<Retailer[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    fetchRes = await this.retailerService.get({
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
      fetchCount = await this.retailerService.countDocuments({
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
      message: 'Retailers Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  /**
   * Saves A Product
   * @return Saves info in DB
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Inventory Wishlist')
  @Post('/wishlist')
  @ApiOperation({ summary: 'Adds product to user wishlist' })
  async addWishList(
    @Body() request: WishListDTO,
  ): Promise<ResponseFormat<UpdateRetailerDTO>> {
    //prevent duplicate entries
    let userFound = await this.retailerService.get({ _id: request.userid });

    if (!userFound) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'An Error Occurred',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (userFound[0].wishlist && userFound[0].wishlist.length > 0) {
      if (
        userFound[0].wishlist.findIndex(
          (x) => x.inventory_id == request.inventoryID,
        ) > -1
      ) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.CONFLICT,
            },
            message: 'Product Already Saved',
          },
          HttpStatus.CONFLICT,
        );
      }
    }

    let newWIshList: SavedInventoryField[] =
      userFound[0].wishlist && userFound[0].wishlist.length > 0
        ? [...userFound[0].wishlist, { inventory_id: request.inventoryID }]
        : [{ inventory_id: request.inventoryID }];

    let updatedUser = await this.retailerService.update(
      { _id: request.userid },
      { wishlist: newWIshList },
    );

    if (!updatedUser) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: updatedUser,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<UpdateRetailerDTO> = {
      message: 'Product added to wishlist',
      data: updatedUser,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Inventory Wishlist')
  @Delete('/wishlist/:userid/:inventory_id')
  @ApiOperation({ summary: 'Removes product from user wishlist' })
  async deleteWishList(
    @Param('userid') userid: string,
    @Param('inventory_id') inventory_id: string,
  ): Promise<ResponseFormat<boolean>> {
    if (!inventory_id || !userid) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'Provide required URL parameters',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //prevent duplicate entries
    let userFound = await this.retailerService.get({ _id: userid });

    if (userFound.length == 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'An Error Occurred',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //ensure product is in wishlist before proceeding
    if (userFound[0].wishlist.length > 0) {
      if (
        userFound[0].wishlist.findIndex(
          (x) => x.inventory_id == inventory_id,
        ) == -1
      ) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.BAD_REQUEST,
            },
            message: 'Product Not In WishList',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    let newWIshList: SavedInventoryField[] = userFound[0].wishlist.filter(
      (x) => x.inventory_id != inventory_id,
    );

    let updatedUser = await this.retailerService.update(
      { _id: userid },
      { wishlist: newWIshList },
    );

    if (!updatedUser) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: updatedUser,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<any> = {
      message: 'Product removed from wishlist',
      data: updatedUser,
      meta: {},
    };
    return obj;
  }
}
