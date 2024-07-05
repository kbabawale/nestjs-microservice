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
import { MeansOfPayment, OrderStatus } from '../model/delivery.model';
import { Order } from '../schemas/order.schema';
import { OrderService } from '../service/order.service';

@Controller('delivery')
export class DeliveryController {
  constructor(
    private readonly orderService: OrderService,
    private readonly pNotiService: PushNotificationService,
    @Inject(ConfigService) public config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Order')
  @Post('order')
  @ApiOperation({ summary: 'Create an order' })
  async createOrder(@Body() request: OrderDTO): Promise<ResponseFormat<Order>> {
    let obj: ResponseFormat<Order> = {
      message: '',
      data: null,
    };

    //validate status and payment type
    if (request.status) {
      let status = Object.values(OrderStatus).includes(
        request.status as OrderStatus,
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
    if (request.payment?.meansOfPayment) {
      let meansOfPayment = Object.values(MeansOfPayment).includes(
        request.payment.meansOfPayment as MeansOfPayment,
      );
      if (!meansOfPayment) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.NOT_ACCEPTABLE,
            },
            message: 'Provide a valid means of payment',
          },
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
    }

    let orderCategory = await this.orderService.create(request);
    if (!orderCategory) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: orderCategory,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    obj = {
      message: 'Order Created',
      data: orderCategory,
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Order')
  @Get('order')
  @ApiOperation({ summary: 'Fetch order(s)' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'retailer',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'payment',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'distributor',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    description:
      'ORDER_CREATED|ORDER_PROCESSED|HEADING_TO_PICKUP|HEADING_TO_DROPOFF|ORDER_DELIVERED',
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
  async getOrder(
    @Query('id') id: string,
    @Query('retailer') retailer: string,
    @Query('payment') payment: string,
    @Query('distributor') distributor: string,
    @Query('status') status: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
  ): Promise<ResponseFormat<PaginatedResponse<Order[]>>> {
    //list requests
    let fetchRes: Order[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let lInt = limit ? Number(limit) : 0;
    let skipInt = skip ? Number(skip) : 0;

    let res: PaginatedResponse<Order[]> = {
      data: [],
      limit: lInt,
      skip: skipInt,
      total: fetchCount,
    };

    let query: FilterQuery<Order> = {};

    if (status) query.status = new RegExp(status, 'i');
    if (retailer) query['retailer.id'] = retailer;
    if (payment) query['payment.status'] = payment;
    if (distributor) query['distributor.id'] = distributor;
    if (payment) query['payment.status'] = query['payment.status'] === 'true';

    if (id) {
      fetchRes = await this.orderService.get({ _id: id }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.orderService.countDocuments({ _id: id });
    } else {
      fetchRes = await this.orderService.get({ ...query }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.orderService.countDocuments({ ...query });
    }

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Order(s) Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Order')
  @Get('order/search')
  @ApiOperation({ summary: 'Search order(s)' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'status',
    type: String,
    required: false,
  })
  async searchOrders(
    @Query('name') name: string,
    @Query('status') status: string,
  ): Promise<ResponseFormat<PaginatedResponse<Order[]>>> {
    let fetchRes: Order[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<Order[]>>;

    //validate status and payment type
    if (status) {
      let statusValidation = Object.values(OrderStatus).includes(
        status as OrderStatus,
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

    let res: PaginatedResponse<Order[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    ///search through name, retailer, distributor & category
    if (status) {
      fetchRes = await this.orderService.get({
        status,
        $or: [
          { 'retailer.businessName': new RegExp(name, 'i') },
          { 'distributor.name': new RegExp(name, 'i') },
        ],
      });
      if (fetchRes.length > 0)
        fetchCount = await this.orderService.countDocuments({
          status,
          $or: [
            { 'retailer.businessName': new RegExp(name, 'i') },
            { 'distributor.name': new RegExp(name, 'i') },
          ],
        });
    } else {
      fetchRes = await this.orderService.get({
        $or: [
          { 'retailer.businessName': new RegExp(name, 'i') },
          { 'distributor.name': new RegExp(name, 'i') },
        ],
      });
      if (fetchRes.length > 0)
        fetchCount = await this.orderService.countDocuments({
          $or: [
            { 'retailer.businessName': new RegExp(name, 'i') },
            { 'distributor.name': new RegExp(name, 'i') },
          ],
        });
    }

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
  @ApiTags('Order')
  @ApiOperation({ summary: 'Updates An Order' })
  @Put('order/:id')
  async updateOrder(
    @Param('id') id: string,
    @Body() request: OrderDTO,
    @Request() req: any,
  ): Promise<ResponseFormat<Order>> {
    let accesstoken: string = req.user.refreshToken;
    //fetch record
    let recordFound = await this.orderService.get({ _id: id });

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
      let statusValidation = Object.values(OrderStatus).includes(
        request.status as OrderStatus,
      );
      if (!statusValidation) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.BAD_REQUEST,
            },
            message: 'Provide a valid Status',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    let updated = await this.orderService.update({ _id: id }, request);
    

    let obj: ResponseFormat<Order> = {
      message: 'Order updated',
      data: updated,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Order')
  @ApiOperation({ summary: 'Deletes An Order' })
  @Delete('order/:id')
  async deleteOrder(@Param('id') id: string): Promise<ResponseFormat<boolean>> {
    let order = await this.orderService.get({ _id: id });

    if (order && order.length > 0) {
      if (
        order[0].status === OrderStatus.HEADING_TO_DROPOFF ||
        order[0].status === OrderStatus.HEADING_TO_PICKUP
      ) {
        throw new HttpException(
          {
            data: {},
            meta: {
              status: HttpStatus.BAD_REQUEST,
            },
            message: 'Cannot delete an order in transit',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    let deleted = await this.orderService.delete({ _id: id });

    let obj: ResponseFormat<boolean> = {
      message: 'Order Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }
}
