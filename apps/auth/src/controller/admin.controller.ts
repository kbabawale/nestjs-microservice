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
import { PostSMS } from '../../../../libs/common/src/util/vonage.model';
import { RequestsService } from '../service/request.service';
import { AdminDTO, UpdateAdminDTO } from '../dto/admin.dto';
import { PaginatedResponse } from '../../../../libs/common/src/util/util';
import { RequestsDTO, UpdateRequestsDTO } from '../dto/requests.dto';
import { AdminRequests } from '../schemas/requests.schema.';
import {
  RequestEmailPayload,
  RequestRetailerPayload,
  RequestVerifyDriverPayload,
  RequestsType,
  RolesPermission,
} from '../model/user.model';
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RetailerService } from '../service/retailer.service';
import { RetailerDTO } from '../dto/retailer.dto';
import { AdminService } from '../service/admin.service';
import { PermissionDTO } from '../dto/permission.dto';
import { Permission } from '../schemas/permission.schema';
import { PermissionService } from '../service/permission.service';
import { RoleDTO } from '../dto/role.dto';
import { Role } from '../schemas/role.schema';
import { RoleService } from '../service/role.service';
import { Adminn } from '../schemas/admin.schema';
import { DriverService } from '../service/driver.service';
import { DriverDTO } from '../dto/driver.dto';

@Controller('auth/admin')
export class AdminController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly distributorService: DistributorService,
    private readonly adminService: AdminService,
    private readonly retailerService: RetailerService,
    private readonly driverService: DriverService,
    private readonly permissionService: PermissionService,
    private readonly roleService: RoleService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  @ApiTags('Admin')
  @Post('')
  @ApiOperation({ summary: 'Registers An Admin User' })
  async addAdmin(@Body() request: AdminDTO): Promise<ResponseFormat<Adminn>> {
    let duplicateFound = await this.adminService.get({
      $or: [{ email: request.email }, { phone: request.phone }],
    });

    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Admin already exists',
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

    let hashedPassword = await this.adminService.hashPassword(request.password);
    request = { ...request, password: hashedPassword };

    let admin = await this.adminService.create(request);

    if (!admin) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: admin,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<any> = {
      message: 'Admin registered',
      data: admin,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Admin')
  @Put(':id')
  @ApiOperation({ summary: 'Updates An Admin User' })
  async updateAdmin(
    @Param('id') id: string,
    @Body() request: UpdateAdminDTO,
  ): Promise<ResponseFormat<Adminn>> {
    //fetch record
    let recordFound = await this.adminService.get({ _id: id });

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
    let admin = await this.adminService.update({ _id: id }, request);

    let obj: ResponseFormat<any> = {
      message: 'Admin updated',
      data: admin,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Admin')
  @Get('/search')
  @ApiOperation({ summary: 'Search Admin' })
  @ApiQuery({
    name: 'name',
    type: String,
    description:
      'Search by first name, last name, business name, email, phone number, fcm token, id',
    required: false,
  })
  async getUser(
    @Query('name') name: string,
  ): Promise<ResponseFormat<PaginatedResponse<Adminn[]>>> {
    //list accounts

    let fetchRes: Adminn[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let res: PaginatedResponse<Adminn[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    fetchRes = await this.adminService.get({
      status: 'Active',
      $or: [
        // { _id: new RegExp(name, 'i') },
        { firstName: new RegExp(name, 'i') },
        { lastName: new RegExp(name, 'i') },
        { email: new RegExp(name, 'i') },
        { phone: new RegExp(name, 'i') },
        { role: new RegExp(name, 'i') },
      ],
    });

    if (fetchRes.length > 0)
      fetchCount = await this.adminService.countDocuments({
        status: 'Active',
        $or: [
          // { _id: new RegExp(name, 'i') },
          { firstName: new RegExp(name, 'i') },
          { lastName: new RegExp(name, 'i') },
          { email: new RegExp(name, 'i') },
          { phone: new RegExp(name, 'i') },
          { role: new RegExp(name, 'i') },
        ],
      });

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Admins Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @ApiTags('Admin')
  @Post('role')
  @ApiOperation({ summary: 'Creates new admin role' })
  async addAdminRole(@Body() request: RoleDTO): Promise<ResponseFormat<Role>> {
    let duplicateFound = await this.roleService.get({ name: request.name });

    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Role already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const added = await this.roleService.create(request);

    if (!added) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: added,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const obj: ResponseFormat<Role> = {
      message: 'Role Saved',
      data: added,
    };
    return obj;
  }

  @ApiTags('Admin')
  @Put('role/:id')
  @ApiOperation({ summary: 'Updates admin role' })
  async updateAdminRole(
    @Param('id') id: string,
    @Body() request: RoleDTO,
  ): Promise<ResponseFormat<Role>> {
    let recordFound = await this.roleService.get({ _id: id });

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

    let updated = await this.roleService.update({ _id: id }, request);

    if (!updated) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: updated,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const obj: ResponseFormat<Role> = {
      message: 'Role Updated',
      data: updated,
    };
    return obj;
  }

  @ApiTags('Admin')
  @Post('role/privilege')
  @ApiOperation({ summary: 'Creates new admin privilege' })
  async addAdminRolePrivilege(
    @Body() request: PermissionDTO,
  ): Promise<ResponseFormat<Permission>> {
    const added = await this.permissionService.create(request);

    const obj: ResponseFormat<Permission> = {
      message: 'Permission Saved',
      data: added,
    };
    return obj;
  }

  @ApiTags('Admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes An Admin' })
  async deleteAdmin(@Param('id') id: string): Promise<ResponseFormat<boolean>> {
    let deleted = await this.adminService.update(
      { _id: id },
      { visible: false },
    );

    let obj: ResponseFormat<boolean> = {
      message: 'Admin Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Admin')
  @Get('role/privilege')
  @ApiOperation({ summary: 'Fetches Admin Roles & Privileges' })
  @ApiQuery({
    name: 'strategy',
    type: String,
    required: false,
    description: 'role or permission (default = role)',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    description: 'ID of role/permission',
  })
  async getAdminRoles(
    @Query('strategy') strategy: string,
    @Query('id') id: string,
  ) {
    let obj: ResponseFormat<any>;
    const chosenStrategy = strategy ? strategy.toUpperCase() : 'ROLE';
    const chosenID = id;

    if (
      ['ROLE', 'PERMISSION'].includes(chosenStrategy.toUpperCase()) === false
    ) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: `"strategy" should be any of these: Role|Permission`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //if id is specified, fetch record from role or permission table
    if (chosenID) {
      const result =
        chosenStrategy === 'ROLE'
          ? await this.roleService.get({ _id: chosenID })
          : await this.permissionService.get({ _id: chosenID });

      obj = {
        message: `${chosenStrategy} fetched`,
        data: result,
        meta: {},
      };
    } else {
      const result =
        chosenStrategy === 'ROLE'
          ? await this.roleService.get()
          : await this.permissionService.get();
      obj = {
        message: `${chosenStrategy} fetched`,
        data: result,
        meta: {},
      };
    }

    return obj;
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('jwt-auth')
  @ApiTags('Requests')
  @Post('request')
  @ApiOperation({ summary: 'Registers A Request' })
  async addRequest(
    @Body() request: RequestsDTO,
  ): Promise<ResponseFormat<AdminRequests>> {
    //validate type
    let validateType: { status: boolean; message?: string } = {
      status: true,
    };

    let currentPayload: RequestEmailPayload | RequestRetailerPayload;

    switch (request.type) {
      case RequestsType.UPDATERETAILERDETAILS:
      case RequestsType.UPDATEDRIVERDETAILS:
        currentPayload = request.payload as RequestRetailerPayload;
        if (!currentPayload) {
          validateType = {
            status: false,
            message: 'Provide New Retailer Object',
          };
        }
        break;
      case RequestsType.VERIFYDRIVER:
        currentPayload = request.payload as RequestVerifyDriverPayload;
        if (!currentPayload.userId) {
          validateType = {
            status: false,
            message: 'Provide UserID',
          };
        }
        break;
      case RequestsType.UPDATEEMAIL:
      default:
        currentPayload = request.payload as RequestEmailPayload;
        if (!currentPayload.newEmail || !currentPayload.userId) {
          validateType = {
            status: false,
            message: 'Provide New Email and UserID',
          };
        }
        break;
    }

    if (!validateType.status) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: validateType.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let newRequest = await this.requestsService.create(request);

    if (!newRequest) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: newRequest,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<AdminRequests> = {
      message: 'Request Sent',
      data: newRequest,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Requests')
  @Get('request')
  @ApiOperation({ summary: 'Lists requests on the platform' })
  @ApiQuery({
    name: 'status',
    type: String,
    description: 'Pending, Approved, Declined',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    type: String,
    description: 'UPDATEEMAIL',
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    type: String,
    required: false,
  })
  async getRequests(
    @Query('type') type: string,
    @Query('status') status: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
  ): Promise<ResponseFormat<PaginatedResponse<any>>> {
    if (
      status &&
      ['PENDING', 'APPROVED', 'DECLINED'].includes(status.toUpperCase()) ===
        false
    ) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: `"status" should be any of these: Pending|Approved|Declined`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //list requests

    let fetchRes,
      fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let lInt = limit ? Number(limit) : 0;
    let skipInt = skip ? Number(skip) : 0;

    let res: PaginatedResponse<any> = {
      data: [],
      limit: lInt,
      skip: skipInt,
      total: fetchCount,
    };

    let fetchParameters: any = {};
    if (status) fetchParameters.status = status;
    if (type) fetchParameters.type = type;

    fetchRes = await this.requestsService.get(fetchParameters, skipInt, lInt);
    if (fetchRes.length > 0)
      fetchCount = await this.requestsService.countDocuments(fetchParameters);

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
  @ApiTags('Requests')
  @Get('request/user')
  @ApiQuery({
    name: 'userid',
    type: String,
    required: true,
    description: '',
  })
  @ApiQuery({
    name: 'type',
    type: String,
    description: 'UPDATEEMAIL',
    required: false,
  })
  @ApiOperation({
    summary: 'Fetches pending individual request on the platform ',
  })
  async getUserRequests(
    @Query('userid') userid: string,
    @Query('type') type: string,
  ): Promise<ResponseFormat<any>> {
    //list requests
    let fetchRes: AdminRequests[];
    let fetchCount = 0;
    let obj: ResponseFormat<any>;

    let typeString = type ? type : 'UPDATEEMAIL';

    if (!userid) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: `Provide User ID`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    fetchRes = await this.requestsService.get({
      $and: [
        { status: 'Pending' },
        { type: typeString },
        { 'payload.userId': userid },
      ],
    });
    if (fetchRes.length > 0)
      fetchCount = await this.requestsService.countDocuments({
        $and: [
          { status: 'Pending' },
          { type: typeString },
          { 'payload.userId': userid },
        ],
      });

    obj = {
      message: 'Requests Fetched',
      data: fetchRes,
      meta: {
        total: fetchCount,
      },
    };

    return obj;
  }

  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth('jwt-auth')
  @ApiTags('Requests')
  @Put('request/:id')
  @ApiOperation({ summary: 'Updates A Request' })
  async updateRequest(
    @Param('id') id: string,
    @Body() request: UpdateRequestsDTO,
  ): Promise<ResponseFormat<AdminRequests>> {
    const transactionSession = await this.connection.startSession();
    transactionSession.startTransaction();

    //fetch record
    let recordFound = await this.requestsService.get({ _id: id });

    if (recordFound.length == 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'Record (Request) not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //handle request updates differently
    switch (recordFound[0].type) {
      case RequestsType.UPDATEEMAIL:
        //fetch user phone number
        let user = await this.distributorService.get({
          _id: recordFound[0].payload.userId,
        });

        if (user.length == 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Record (user) not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        //if status is approved, update email + request status
        //else update only request status
        if (request.status.toUpperCase() == 'APPROVED') {
          let updateEmail = await this.distributorService.update(
            { _id: user[0]._id },
            { email: recordFound[0].payload.newEmail },
            { session: transactionSession },
          );
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
            { session: transactionSession },
          );
          if (!updateEmail || !newRequest) {
            await transactionSession.abortTransaction();
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: user[0].phone,
              text: `Request to update your Storedash email address has been ${request.status
                .trim()
                .toLowerCase()}`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
          await transactionSession.commitTransaction();
        } else {
          //it is declined
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
          );
          if (!newRequest) {
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: user[0].phone,
              text: `Request to update your Storedash email address has been ${request.status
                .trim()
                .toLowerCase()}`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
        }

        break;

      case RequestsType.UPDATERETAILERDETAILS:
        //fetch user phone number
        let retailerUser = await this.retailerService.get({
          _id: recordFound[0].payload.userId,
        });

        if (retailerUser.length == 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Record (user) not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        //if status is approved, update retailer info + request status
        //else update only request status
        if (request.status.toUpperCase() == 'APPROVED') {
          let updateBody: Partial<RetailerDTO> = {};
          let currentPayload = recordFound[0].payload as RequestRetailerPayload;
          if (currentPayload.firstName)
            updateBody.firstName = currentPayload.firstName;
          if (currentPayload.lastName)
            updateBody.lastName = currentPayload.lastName;
          if (currentPayload.phone) updateBody.phone = currentPayload.phone;
          if (currentPayload.storeAddress)
            updateBody.storeAddress = currentPayload.storeAddress;
          if (currentPayload.storeAddressCoordinates)
            updateBody.storeAddressCoordinates =
              currentPayload.storeAddressCoordinates;

          let updateRetailer = await this.retailerService.update(
            { _id: retailerUser[0]._id },
            currentPayload,
            { session: transactionSession },
          );
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
            { session: transactionSession },
          );
          if (!updateRetailer || !newRequest) {
            await transactionSession.abortTransaction();
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: retailerUser[0].phone,
              text: `Request to update your Storedash details has been ${request.status
                .trim()
                .toLowerCase()}`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
          await transactionSession.commitTransaction();
        } else {
          //it is declined
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
          );
          if (!newRequest) {
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: retailerUser[0].phone,
              text: `Request to update your Storedash details has been ${request.status
                .trim()
                .toLowerCase()}`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
        }
        break;
      case RequestsType.UPDATEDRIVERDETAILS:
        //fetch user phone number
        let driverUser = await this.driverService.get({
          _id: recordFound[0].payload.userId,
        });

        if (driverUser.length == 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Record (user) not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        //if status is approved, update driver info + request status
        //else update only request status
        if (request.status.toUpperCase() == 'APPROVED') {
          let updateBody: Partial<DriverDTO> = {};
          let currentPayload = recordFound[0].payload as RequestRetailerPayload;
          if (currentPayload.firstName)
            updateBody.firstName = currentPayload.firstName;
          if (currentPayload.lastName)
            updateBody.lastName = currentPayload.lastName;
          if (currentPayload.phone) updateBody.phone = currentPayload.phone;
          if (currentPayload.storeAddress)
            updateBody.residentialAddress = currentPayload.storeAddress;
          if (currentPayload.storeAddressCoordinates)
            updateBody.residentialAddressCoordinates =
              currentPayload.storeAddressCoordinates;

          let updateDriver = await this.driverService.update(
            { _id: driverUser[0]._id },
            currentPayload,
            { session: transactionSession },
          );
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
            { session: transactionSession },
          );
          if (!updateDriver || !newRequest) {
            await transactionSession.abortTransaction();
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: driverUser[0].phone,
              text: `Request to update your Storedash details has been ${request.status
                .trim()
                .toLowerCase()}`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
          await transactionSession.commitTransaction();
        } else {
          //it is declined
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
          );
          if (!newRequest) {
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: driverUser[0].phone,
              text: `Request to update your Storedash details has been ${request.status
                .trim()
                .toLowerCase()}`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
        }
        break;
      case RequestsType.VERIFYDRIVER:
        //fetch user phone number
        let driverUser2 = await this.driverService.get({
          _id: recordFound[0].payload.userId,
        });

        if (driverUser2.length == 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Record (user) not found',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        if (request.status.toUpperCase() == 'APPROVED') {
          let updateBody: Partial<DriverDTO> = {
            verified: true,
          };

          let updateDriver = await this.driverService.update(
            { _id: driverUser2[0]._id },
            updateBody,
            { session: transactionSession },
          );
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
            { session: transactionSession },
          );
          if (!updateDriver || !newRequest) {
            await transactionSession.abortTransaction();
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: driverUser2[0].phone,
              text: `Your Storedash driver account has been verified`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
          await transactionSession.commitTransaction();
        } else {
          //it is declined
          let newRequest = await this.requestsService.update(
            { _id: id },
            request,
          );
          if (!newRequest) {
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

          //if request is approved or declined, alert user of update
          if (request.status) {
            let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
              from: 'Storedash',
              to: driverUser2[0].phone,
              text: `Your Storedash driver account verification has been rejected`,
            };
            await this.requestsService.sendSMSTwilio(SMSOBJ);
          }
        }
        break;
    }
    transactionSession.endSession();

    let obj: ResponseFormat<any> = {
      message: 'Request Updated',
      data: true,
      meta: {},
    };
    return obj;
  }
}
