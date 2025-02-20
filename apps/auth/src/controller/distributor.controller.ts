import { validatePhoneNumber } from '../../../../libs/common/src/util/formatPhone';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
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
import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { DistributorService } from '../service/distributor.service';
import { DistributorDTO, UpdateDistributorDTO } from '../dto/distributor.dto';
import { Distributor } from '../schemas/distributor.schema';
import { PostSMS } from '../../../../libs/common/src/util/vonage.model';
import { PaginatedResponse } from 'libs/common/src/util/util';

@Controller('auth/distributor')
export class DistributorController {
  constructor(private readonly distributorService: DistributorService) {}

  /**
   * Endpoint generates a default password, sends via SMS, and creates the distributor account.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Distributor')
  @Post('')
  @ApiOperation({
    summary: 'Registers A Distributor',
    description:
      'Create a new distributor account with a randomly generated password (if not user-provided)',
  })
  async addDistributor(
    @Body() request: DistributorDTO,
  ): Promise<ResponseFormat<Distributor>> {
    let passwordState: { autoGenerated: boolean; currentPassword: string };

    //set default password if not provided
    const defaultPassword: string =
      this.distributorService.generateRandomPassword(5, 3, 2);

    if (!request.hasOwnProperty('password')) {
      passwordState = { autoGenerated: true, currentPassword: defaultPassword };
      request = { ...request, password: defaultPassword };
    }
    passwordState = { autoGenerated: false, currentPassword: request.password };

    //prevent duplicate entries
    let duplicateFound = await this.distributorService.get({
      $or: [{ email: request.email }, { phone: request.phone }],
    });
    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Distributor already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    //validate and add new Distributor
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

    let hashedPassword = await this.distributorService.hashPassword(
      request.password,
    );
    request = { ...request, password: hashedPassword };

    let distributor = await this.distributorService.create(request);

    if (!distributor) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: distributor,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //send SMS to user if necessary (if system generated the password)
    // if(generatedPassword){
    //   let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
    //     from: 'Storedash',
    //     to: request.phone,
    //     text: `Hello ${request.firstName}, Your distributor account password is ${defaultPassword}.`,
    //   };

    //   let SMSSent = await this.distributorService.sendSMSTwilio(SMSOBJ);

    //   if (typeof SMSSent !== 'boolean') {
    //     throw new HttpException(
    //       {
    //         data: {},
    //         message: `Could not send SMS`,
    //       },
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // }

    let obj: ResponseFormat<any> = {
      message: 'Distributor Account Created',
      data: distributor,
      meta: {
        defaultPassword: passwordState.currentPassword,
      },
    };
    return obj;
  }

  @ApiTags('Distributor')
  @Get('/search')
  @ApiOperation({ summary: 'Search distributor' })
  @ApiQuery({
    name: 'name',
    type: String,
    description:
      'Search by first name, last name, business name, email, phone number, fcm token, id',
    required: false,
  })
  async getUser(
    @Query('name') name: string,
  ): Promise<ResponseFormat<PaginatedResponse<Distributor[]>>> {
    //list accounts

    let fetchRes: Distributor[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let res: PaginatedResponse<Distributor[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    fetchRes = await this.distributorService.get({
      status: 'Active',
      $or: [
        // { _id: new RegExp(name, 'i') },
        { firstName: new RegExp(name, 'i') },
        { lastName: new RegExp(name, 'i') },
        { businessName: new RegExp(name, 'i') },
        { email: new RegExp(name, 'i') },
        { phone: new RegExp(name, 'i') },
      ],
    });

    if (fetchRes.length > 0)
      fetchCount = await this.distributorService.countDocuments({
        status: 'Active',
        $or: [
          // { _id: new RegExp(name, 'i') },
          { firstName: new RegExp(name, 'i') },
          { lastName: new RegExp(name, 'i') },
          { businessName: new RegExp(name, 'i') },
          { email: new RegExp(name, 'i') },
          { phone: new RegExp(name, 'i') },
        ],
      });

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Distributors Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @ApiTags('Distributor')
  @Get('/dropdown')
  @ApiOperation({ summary: 'List of all distributors' })
  async getDropdownList(): Promise<ResponseFormat<any>> {
    //list accounts

    let obj: ResponseFormat<any>;

    const res = await this.distributorService.get();
    const result = res.map((res) => res.businessName);

    obj = {
      message: 'Distributors Fetched',
      data: result,
      meta: {},
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Distributor')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes A Distributor' })
  async deleteDistributor(
    @Param('id') id: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.distributorService.update(
      { _id: id },
      { visible: false },
    );

    let obj: ResponseFormat<any> = {
      message: 'Distributor Deleted',
      data: deleted,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Distributor')
  @Put(':id')
  @ApiOperation({ summary: 'Updates A Distributor' })
  async updateDistributor(
    @Param('id') id: string,
    @Body() request: UpdateDistributorDTO,
  ): Promise<ResponseFormat<Distributor>> {
    //fetch record
    let recordFound = await this.distributorService.get({ _id: id });

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

    //validate and update Distributor
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
    let distributor = await this.distributorService.update(
      { _id: id },
      request,
    );

    let obj: ResponseFormat<Distributor> = {
      message: 'Distributor updated',
      data: distributor,
      meta: {},
    };
    return obj;
  }
}
