import { ResponseFormat } from '../../../../libs/common/src/util/response';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Cache as RedisCache } from 'cache-manager';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostSMS } from '../../../../libs/common/src/util/vonage.model';
import { RetailerService } from '../service/retailer.service';
import { createOTP } from '../../../../libs/common/src/util/createSMS';
import {
  EmailType,
  ForgotPasswordEmail,
  ForgotPasswordPhone,
  GenNewPassword,
  LoginObj,
  LogoutObj,
  NewPassword,
  PushNotificationField,
  RegenerateToken,
  SendEmail,
  SendOTP,
  SendOTPNIN,
  SetNewPassword,
  VerifyEmailOTP,
  VerifyOTP,
} from '../model/user.model';
import * as mongoose from 'mongoose';
import { DriverService } from '../service/driver.service';
import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { AuthService } from '../service/auth.service';
import {
  SmileIdentityPayload,
  SmileIdentityResult,
} from '../../../../libs/common/src/util/smileIdentity.model';
import { DistributorService } from '../service/distributor.service';
import { PaginatedResponse } from '../../../../libs/common/src/util/util';
import { StaffService } from '../service/staff.service';
import { PushNotificationService } from '../../../../libs/common/src/util/PushNotification/pushNotification';
import { Retailer } from '../schemas/retailer.schema';
import { Driver } from '../schemas/driver.schema';
import { Distributor } from '../schemas/distributor.schema';
import RedisSingleton from '../../../../libs/common/src/redis/connect';
import { AdminService } from '../service/admin.service';
import { OTPService } from '../service/otp.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly retailerService: RetailerService,
    private readonly authService: AuthService,
    private readonly distributorService: DistributorService,
    private readonly adminService: AdminService,
    private readonly otpService: OTPService,
    private readonly staffService: StaffService,
    private readonly pNotiService: PushNotificationService,
    private readonly driverService: DriverService, // @Inject(CACHE_MANAGER) private cacheManager: RedisCache,
  ) {}

  @ApiTags('OTP')
  @Post('otp/verify')
  @ApiOperation({ summary: 'Verifies OTP sent to user' })
  async verifyOTP(
    @Body() request: VerifyOTP,
  ): Promise<ResponseFormat<boolean>> {
    let obj: ResponseFormat<boolean> = {
      message: '',
      data: false,
      meta: {},
    };

    const cachedOTP = await this.otpService.get({
      telephone: request.phone,
      token: request.otp,
    });

    if (cachedOTP.length > 0) {
      if (cachedOTP[0].token !== request.otp) {
        obj = {
          message: `You've entered the wrong OTP. Please try again`,
          data: false,
          meta: {},
        };
      } else {
        const startTime = new Date(cachedOTP[0]['createdAt']);
        const endTime = new Date();
        const difference = (endTime.getTime() - startTime.getTime()) / 60000;

        if (difference > 5) {
          obj = {
            message: `OTP has timed out`,
            data: false,
            meta: {},
          };
          await this.otpService.delete({
            _id: cachedOTP[0]._id,
          });
        } else {
          obj = {
            message: 'OTP Valid',
            data: true,
            meta: {},
          };
          await this.otpService.delete({
            _id: cachedOTP[0]._id,
          });
        }
      }
    } else {
      obj = {
        message: `You've entered the wrong OTP. Please try again`,
        data: false,
        meta: {},
      };
    }

    return obj;
  }

  @ApiTags('OTP')
  @Post('otp/email/verify')
  @ApiOperation({ summary: 'Verifies OTP sent to user via email' })
  async verifyEmailOTP(
    @Body() request: VerifyEmailOTP,
  ): Promise<ResponseFormat<boolean>> {
    let obj: ResponseFormat<boolean> = {
      message: '',
      data: false,
      meta: {},
    };

    const cachedOTP = await this.otpService.get({
      telephone: request.email,
      token: request.otp,
    });

    if (cachedOTP.length > 0) {
      if (cachedOTP[0].token !== request.otp) {
        obj = {
          message: `You've entered the wrong OTP. Please try again`,
          data: false,
          meta: {},
        };
      } else {
        const startTime = new Date(cachedOTP[0]['createdAt']);
        const endTime = new Date();
        const difference = (endTime.getTime() - startTime.getTime()) / 60000;

        if (difference > 5) {
          obj = {
            message: `OTP has timed out`,
            data: false,
            meta: {},
          };
          await this.otpService.delete({
            _id: cachedOTP[0]._id,
          });
        } else {
          obj = {
            message: 'OTP Valid',
            data: true,
            meta: {},
          };
          await this.otpService.delete({
            _id: cachedOTP[0]._id,
          });
        }
      }
    } else {
      obj = {
        message: `You've entered the wrong OTP. Please try again`,
        data: false,
        meta: {},
      };
    }

    return obj;
  }

  @ApiTags('OTP')
  @Post('otp')
  @ApiOperation({
    summary: 'Sends OTP to user via SMS',
    description:
      "If email is provided, phone number is fetched from distributor's account",
  })
  async sendOTP(@Body() request: SendOTP): Promise<ResponseFormat<boolean>> {
    //ensure user is registered
    const otp = createOTP();

    if (request.email) {
      let distributorFound = await this.distributorService.get({
        email: request.email,
      });
      if (!distributorFound) {
        throw new HttpException(
          {
            data: {},
            message: 'Could not send code. Please try again',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      //send OTP by SMS
      let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
        from: 'Storedash',
        to: distributorFound[0].phone,
        text: `Your OTP for Storedash sign up is ${otp}`,
      };
      let SMSSent = await this.authService.sendSMSTwilio(SMSOBJ);
      //if sent, cache otp in redis
      if (typeof SMSSent === 'boolean') {
        await this.otpService.create({
          telephone: distributorFound[0].phone,
          token: otp,
        });
      } else {
        throw new HttpException(
          {
            data: {},
            message: `Could not send OTP`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      //send OTP by SMS
      let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
        from: 'Storedash',
        to: request.phone,
        text: `Your OTP for Storedash sign up is ${otp}`,
      };
      let SMSSent = await this.authService.sendSMSTwilio(SMSOBJ);
      //if sent, cache otp in redis
      if (typeof SMSSent === 'boolean') {
        await this.otpService.create({ telephone: request.phone, token: otp });
      } else {
        throw new HttpException(
          {
            data: {},
            message: `Could not send OTP`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    let obj: ResponseFormat<boolean> = {
      message: 'OTP Sent',
      data: true,
      meta: {},
    };
    return obj;
  }

  @ApiTags('OTP')
  @Post('otp/nin')
  @ApiOperation({ summary: 'Sends OTP to user using NIN details' })
  @ApiResponse({
    description:
      'Returns validated user detail if correct, false if system error',
  })
  async sendOTPNIN(
    @Body() request: SendOTPNIN,
  ): Promise<ResponseFormat<Partial<SmileIdentityResult>>> {
    let obj: ResponseFormat<Partial<SmileIdentityResult>> = {
      message: '',
      data: {},
      meta: {},
    };

    let otp = createOTP();

    const { createHmac } = await import('crypto');
    let timestamp = new Date().toISOString();
    const hmac = createHmac('sha256', 'fc4746d6-8b7f-4eee-bb62-84234ef7bcc3');
    hmac.update(timestamp);
    hmac.update('2255');
    hmac.update('sid_request');
    const signature = hmac.digest('base64');

    //validate nin
    let payload: SmileIdentityPayload = {
      partner_id: '2255',
      source_sdk: 'rest_api',
      source_sdk_version: '1.0.0',
      timestamp,
      signature,
      country: 'NG',
      id_type: 'NIN',
      id_number: request.nin.trim(),
      partner_params: {
        job_id: uuidv4(),
        // job_type: '5',
        user_id: request.nin.trim(),
      },
    };

    let validation = await this.authService.validateNIN(payload);
    if (validation.ResultCode && validation.ResultCode === '1012') {
      //if nin is test code, send to my phone number
      const telephone =
        request.nin === '00000000004'
          ? '+2348173919359'
          : validation.PhoneNumber;

      // send OTP by SMS
      let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
        from: 'Storedash',
        to: telephone,
        text: `Your OTP is ${otp}`,
      };

      let SMSSent = await this.authService.sendSMSTwilio(SMSOBJ);
      // let SMSSent = true;

      const response: Partial<SmileIdentityResult> = {
        DOB: validation.DOB,
        FullName: validation.FullName,
        PhoneNumber:
          request.nin === '00000000004'
            ? '+2348173919359'
            : validation.PhoneNumber,
      };

      //if sent, cache otp in redis
      if (typeof SMSSent === 'boolean') {
        await this.otpService.create({ telephone, token: otp });
      } else {
        throw new HttpException(
          {
            data: {},
            message: `Could not send OTP`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      obj = {
        ...obj,
        data: response,
        message: `SMS Sent to ${telephone}`,
      };
    } else {
      obj = { ...obj, data: null, message: validation.ResultText };
    }

    return obj;
  }

  @ApiTags('Email')
  @Post('email')
  @ApiOperation({
    summary: 'Sends Email to user (performs adhoc operations)',
  })
  async sendEmail(
    @Body() request: SendEmail,
  ): Promise<ResponseFormat<boolean>> {
    let generatedOtp = createOTP();

    switch (request.type.toUpperCase()) {
      case EmailType.GENERAL:
        await this.authService.sendEmail(
          request.email,
          request.subject,
          './general',
          {
            payload: request.data.payload,
          },
        );
        break;
      case EmailType.SENDOTP:
      default: //expires in 5 minutes
        await this.authService.sendEmail(
          request.email,
          request.subject,
          './otp',
          {
            name: request.data.name,
            otp: generatedOtp,
          },
        );

        await this.otpService.create({
          token: generatedOtp,
          telephone: request.email,
        });

        break;
    }

    let obj: ResponseFormat<boolean> = {
      message: 'Email Sent',
      data: true,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Password')
  @Post('password/forgot')
  @ApiOperation({
    summary: 'Initiates forgot password process. Sends OTP to user',
  })
  async forgotPassword(
    @Body() request: ForgotPasswordPhone,
  ): Promise<ResponseFormat<string>> {
    //fetch record
    let userFound: boolean = false;
    //ensure user is registered on platform
    switch (request.platform.toUpperCase()) {
      case 'RETAILER':
        let retailerFound = await this.retailerService.get({
          phone: request.phone,
        });
        if (retailerFound[0].id) {
          userFound = true;
        }
        break;
      case 'DRIVER':
        let driverFound = await this.driverService.get({
          phone: request.phone,
        });
        if (driverFound[0].id) {
          userFound = true;
        }
        break;
      case 'DISTRIBUTOR':
        let distributorFound = await this.distributorService.get({
          phone: request.phone,
        });
        if (distributorFound[0].id) {
          userFound = true;
        }
        break;
    }

    if (!userFound) {
      throw new HttpException(
        {
          data: {},
          message: `Invalid User`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let otp = createOTP();
    //send OTP by SMS
    let SMSOBJ: Omit<PostSMS, 'api_key' | 'api_secret'> = {
      from: 'Storedash',
      to: request.phone,
      text: `Your One Time Password is ${otp}`,
    };
    let SMSSent = await this.authService.sendSMSTwilio(SMSOBJ);
    //if sent, cache otp in redis
    if (typeof SMSSent === 'boolean') {
      await this.otpService.create({ telephone: request.phone, token: otp });
    } else {
      throw new HttpException(
        {
          data: {},
          message: `Could not send OTP to ${request.phone}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<string> = {
      message: 'OTP Sent',
      data: '',
      meta: {},
    };
    return obj;
  }

  @ApiTags('Password')
  @Post('password/forgot/email')
  @ApiOperation({
    summary: 'Initiates forgot password process. Sends OTP to user by email',
  })
  async forgotPasswordEmail(
    @Body() request: ForgotPasswordEmail,
  ): Promise<ResponseFormat<boolean>> {
    let redis = RedisSingleton.getInstance();

    //fetch record
    let userFound: boolean = false;
    let username = '';
    //ensure user is registered on platform
    switch (request.platform.toUpperCase()) {
      case 'RETAILER':
        let retailerFound = await this.retailerService.get({
          email: request.email,
        });
        if (retailerFound[0]._id) {
          userFound = true;
          username = `${retailerFound[0].firstName} ${retailerFound[0].lastName}`;
        }
        break;
      case 'DRIVER':
        let driverFound = await this.driverService.get({
          email: request.email,
        });
        if (driverFound[0]._id) {
          userFound = true;
          username = `${driverFound[0].firstName} ${driverFound[0].lastName}`;
        }
        break;
      case 'DISTRIBUTOR':
        let distributorFound = await this.distributorService.get({
          email: request.email,
        });
        if (distributorFound[0]._id) {
          userFound = true;
          username = `${distributorFound[0].firstName} ${distributorFound[0].lastName}`;
        }
        break;
    }

    if (!userFound) {
      throw new HttpException(
        {
          data: {},
          message: `Invalid User`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let otp = createOTP();
    //send OTP by SMS
    await this.authService.sendEmail(
      request.email,
      'Password Recovery Code',
      './otp',
      {
        name: username,
        otp,
      },
    );

    await redis.set(`OTP-${request.email}`, otp, 'EX', 300);

    let obj: ResponseFormat<boolean> = {
      message: 'OTP Sent. Check your email',
      data: true,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Password')
  @Post('password/compare')
  @ApiOperation({ summary: 'Compares passwords' })
  async comparePassword(
    @Body() request: NewPassword,
  ): Promise<ResponseFormat<boolean>> {
    let res;
    let obj: ResponseFormat<boolean>;
    switch (request.platform.toUpperCase()) {
      case 'RETAILER':
        let retailerFound = await this.retailerService.get({
          _id: request.id,
        });
        if (!retailerFound) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let validRetailerPassword = await this.retailerService.comparePasswords(
          request.password,
          retailerFound[0].password,
        );
        obj = {
          message: validRetailerPassword
            ? 'Current Password is correct'
            : 'Current Password is incorrect',
          data: validRetailerPassword,
        };

        break;
      case 'ADMIN':
        let adminFound = await this.adminService.get({
          _id: request.id,
        });
        if (!adminFound) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let validAdminPassword = await this.adminService.comparePasswords(
          request.password,
          adminFound[0].password,
        );
        obj = {
          message: validAdminPassword
            ? 'Current Password is correct'
            : 'Current Password is incorrect',
          data: validAdminPassword,
        };

        break;
      case 'DRIVER':
        let driverFound = await this.driverService.get({
          _id: request.id,
        });
        if (!driverFound) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let validDriverPassword = await this.driverService.comparePasswords(
          request.password,
          driverFound[0].password,
        );
        obj = {
          message: validDriverPassword
            ? 'Current Password is correct'
            : 'Current Password is incorrect',
          data: validDriverPassword,
        };

        break;
      case 'DISTRIBUTOR':
        let distributorFound = await this.distributorService.get({
          _id: request.id,
        });
        if (!distributorFound) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        let validDistributorPassword =
          await this.distributorService.comparePasswords(
            request.password,
            distributorFound[0].password,
          );
        obj = {
          message: validDistributorPassword
            ? 'Current Password is correct'
            : 'Current Password is incorrect',
          data: validDistributorPassword,
        };

        break;
    }
    return obj;
  }

  @ApiTags('Password')
  @Post('password/setup')
  @ApiOperation({ summary: 'Sets new password' })
  async setNewPassword(
    @Body() request: SetNewPassword,
  ): Promise<ResponseFormat<boolean>> {
    let hashedPassword = await this.authService.hashPassword(request.password);

    let res;
    let obj: ResponseFormat<boolean>;

    switch (request.platform.toUpperCase()) {
      case 'RETAILER':
        // update user profile with new password
        res = await this.retailerService.update(
          { _id: request.id },
          { password: hashedPassword },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Password Changed',
          data: true,
          meta: {},
        };
        break;
      case 'ADMIN':
        // update user profile with new password
        res = await this.adminService.update(
          { _id: request.id },
          { password: hashedPassword },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Password Changed',
          data: true,
          meta: {},
        };
        break;
      case 'DISTRIBUTOR':
        // update user profile with new password
        //if first time changing password, mark in db

        res = await this.distributorService.update(
          { _id: request.id },
          { password: hashedPassword, firstPasswordReset: true },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Password Changed',
          data: true,
          meta: {},
        };
        break;
      case 'DRIVER':
        // update user profile with new password
        res = await this.driverService.update(
          { _id: request.id },
          { password: hashedPassword },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Password Changed',
          data: true,
          meta: {},
        };
    }
    return obj;
  }

  @ApiTags('Password')
  @Post('password/token/regenerate')
  @ApiOperation({ summary: 'Refresh user session tokens' })
  async refreshToken(
    @Body() body: RegenerateToken,
  ): Promise<ResponseFormat<boolean>> {
    let obj: ResponseFormat<boolean>;
    let payload, accesstoken, refreshtoken, res, tokenObj;
    let foundUser: any;
    switch (body.platform.toUpperCase()) {
      case 'RETAILER':
        foundUser = await this.retailerService.get({
          refreshToken: body.refreshToken,
        });

        if (!foundUser) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        //generate new set of access and refresh tokens
        payload = {
          type: 'Retailer',
          email: foundUser[0].email,
          sub: foundUser[0].id,
        };
        accesstoken = await this.retailerService.generateJWT(payload);
        refreshtoken = await this.retailerService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.retailerService.update(
          { _id: foundUser[0]._id },
          { refreshToken: tokenObj.refresh_token },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Token Refreshed',
          data: true,
          meta: {
            authToken: tokenObj,
          },
        };

        break;
      case 'DISTRIBUTOR':
        foundUser = await this.distributorService.get({
          refreshToken: body.refreshToken,
        });
        if (!foundUser) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        //generate new set of access and refresh tokens
        payload = {
          type: 'Distributor',
          email: foundUser[0].email,
          sub: foundUser[0].id,
        };
        accesstoken = await this.distributorService.generateJWT(payload);
        refreshtoken = await this.distributorService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.distributorService.update(
          { _id: foundUser[0]._id },
          { refreshToken: tokenObj.refresh_token },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Token Refreshed',
          data: true,
          meta: {
            authToken: tokenObj,
          },
        };
        break;
      case 'DRIVER':
        foundUser = await this.driverService.get({
          refreshToken: body.refreshToken,
        });
        if (!foundUser) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        //generate new set of access and refresh tokens
        payload = {
          type: 'Driver',
          email: foundUser[0].email,
          sub: foundUser[0].id,
        };
        accesstoken = await this.driverService.generateJWT(payload);
        refreshtoken = await this.driverService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.driverService.update(
          { _id: foundUser[0]._id },
          { refreshToken: tokenObj.refresh_token },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Token Refreshed',
          data: true,
          meta: {
            authToken: tokenObj,
          },
        };
        break;
    }

    return obj;
  }

  @ApiTags('Authentication')
  @Post('login')
  @ApiOperation({
    summary: 'Creates user session',
    description:
      'Authenticates and generates session tokens for Retailers and Drivers, Authenticates for Distributors',
  })
  async login(@Body() request: LoginObj): Promise<ResponseFormat<any>> {
    let obj: ResponseFormat<any>;
    let payload, accesstoken, refreshtoken, res, tokenObj;

    //fetch record
    switch (request.platform.toUpperCase()) {
      case 'RETAILER':
        let retailerFound = await this.retailerService.get({
          $or: [{ email: request.email }, { phone: request.phone }],
        });
        if (retailerFound.length == 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (
          (retailerFound.length > 0 && !retailerFound[0].visible) ||
          (retailerFound.length > 0 &&
            retailerFound[0].status.toUpperCase() != 'ACTIVE')
        ) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'This account has been blocked',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        let validPassword = await this.retailerService.comparePasswords(
          request.password,
          retailerFound[0].password,
        );
        if (!validPassword) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        payload = {
          type: 'Retailer',
          email: retailerFound[0].email,
          sub: retailerFound[0].id,
        };
        accesstoken = await this.retailerService.generateJWT(payload);
        refreshtoken = await this.retailerService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.retailerService.update(
          { _id: retailerFound[0]._id },
          { refreshToken: tokenObj.refresh_token, lastLoginTime: new Date() },
        );
        if (!res) {
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

        obj = {
          message: 'Retailer Authenticated',
          data: res,
          meta: {
            authToken: tokenObj,
          },
        };

        break;
      case 'DRIVER':
        let driverFound = await this.driverService.get({
          $or: [{ email: request.email }, { phone: request.phone }],
        });
        if (driverFound.length === 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (driverFound.length > 0 && !driverFound[0].visible) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'This account has been blocked',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        let validPasswordD = await this.driverService.comparePasswords(
          request.password,
          driverFound[0].password,
        );
        if (!validPasswordD) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        payload = {
          type: 'Driver',
          email: driverFound[0].email,
          sub: driverFound[0].id,
        };
        accesstoken = await this.driverService.generateJWT(payload);
        refreshtoken = await this.driverService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.driverService.update(
          { _id: driverFound[0]._id },
          { refreshToken: tokenObj.refresh_token, lastLoginTime: new Date() },
        );
        if (!res) {
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

        obj = {
          message: 'Driver Authenticated',
          data: res,
          meta: {
            authToken: tokenObj,
          },
        };
        break;
      case 'DISTRIBUTOR':
        let distributorFound = await this.distributorService.get({
          email: request.email,
        });
        if (distributorFound.length === 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (distributorFound.length > 0 && !distributorFound[0].visible) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'This account has been blocked',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        let validDPassword = await this.distributorService.comparePasswords(
          request.password,
          distributorFound[0].password,
        );
        if (!validDPassword) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        payload = {
          type: 'Distributor',
          email: distributorFound[0].email,
          sub: distributorFound[0].id,
        };
        accesstoken = await this.distributorService.generateJWT(payload);
        refreshtoken = await this.distributorService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.distributorService.update(
          { _id: distributorFound[0]._id },
          { refreshToken: tokenObj.refresh_token, lastLoginTime: new Date() },
        );
        if (!res) {
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

        obj = {
          message: 'Distributor Authenticated',
          data: res,
          meta: {
            authToken: tokenObj,
          },
        };

        break;
      case 'ADMIN':
        let adminFound = await this.adminService.get({
          $or: [{ email: request.email }, { phone: request.phone }],
        });
        if (adminFound.length == 0) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        if (
          (adminFound.length > 0 && !adminFound[0].visible) ||
          (adminFound.length > 0 &&
            adminFound[0].status.toUpperCase() != 'ACTIVE')
        ) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'This account has been blocked',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }

        let validPasswordAdmin = await this.adminService.comparePasswords(
          request.password,
          adminFound[0].password,
        );
        if (!validPasswordAdmin) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.UNAUTHORIZED,
              },
              message: 'Invalid Login',
            },
            HttpStatus.UNAUTHORIZED,
          );
        }
        payload = {
          type: 'Admin',
          email: adminFound[0].email,
          sub: adminFound[0].id,
        };
        accesstoken = await this.adminService.generateJWT(payload);
        refreshtoken = await this.adminService.generateJWT(payload, '1y');

        tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

        // update user profile with refresh token
        res = await this.adminService.update(
          { _id: adminFound[0]._id },
          { refreshToken: tokenObj.refresh_token, lastLoginTime: new Date() },
        );
        if (!res) {
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

        obj = {
          message: 'Admin Authenticated',
          data: res,
          meta: {
            authToken: tokenObj,
          },
        };

        break;
    }

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Authentication')
  @Post('logout')
  @ApiOperation({ summary: 'Invalidates user session' })
  async logout(@Body() request: LogoutObj): Promise<ResponseFormat<boolean>> {
    let found, res;
    let obj: ResponseFormat<boolean>;

    switch (request.platform.toUpperCase()) {
      case 'RETAILER':
        found = await this.retailerService.get({
          _id: request.id,
        });
        if (!found) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // update user profile with no refresh token
        res = await this.retailerService.update(
          { _id: found[0]._id },
          { refreshToken: '' },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Logged out',
          data: true,
          meta: {},
        };
        break;
      case 'DRIVER':
        found = await this.driverService.get({
          _id: request.id,
        });
        if (!found) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // update user profile with no refresh token
        res = await this.driverService.update(
          { _id: found[0]._id },
          { refreshToken: '' },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Logged out',
          data: true,
          meta: {},
        };
        break;
      case 'DISTRIBUTOR':
        found = await this.distributorService.get({
          _id: request.id,
        });
        if (!found) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // update user profile with no refresh token
        res = await this.distributorService.update(
          { _id: found[0]._id },
          { refreshToken: '' },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Logged out',
          data: true,
          meta: {},
        };
        break;
      case 'ADMIN':
        found = await this.adminService.get({
          _id: request.id,
        });
        if (!found) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: 'Invalid User',
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        // update user profile with no refresh token
        res = await this.adminService.update(
          { _id: found[0]._id },
          { refreshToken: '' },
        );
        if (!res) {
          throw new HttpException(
            {
              data: {},
              meta: {
                status: HttpStatus.BAD_REQUEST,
              },
              message: res,
            },
            HttpStatus.BAD_REQUEST,
          );
        }

        obj = {
          message: 'Logged out',
          data: true,
          meta: {},
        };
        break;
    }
    return obj;
  }

  @ApiTags('UTIL')
  @Post('password/generate')
  @ApiOperation({ summary: 'Generate hashed password' })
  async generatePassword(@Body() body: GenNewPassword) {
    let hashedPassword = await this.authService.hashPassword(body.password);
    let obj: ResponseFormat<string> = {
      message: 'Password generated',
      data: hashedPassword,
      meta: {},
    };
    return obj;
  }

  @ApiTags('UTIL')
  @Get('token/generate')
  @ApiOperation({ summary: 'Generate hashed password' })
  async generateToken() {
    let payload = {
      id: 'ddd',
      email: 'temp',
      sub: 'temp123',
    };

    let accesstoken = await this.authService.generateJWT(payload);
    let refreshtoken = await this.authService.generateJWT(payload, '1y');

    let tokenObj = { access_token: accesstoken, refresh_token: refreshtoken };

    let obj: ResponseFormat<any> = {
      message: 'Token generated',
      data: tokenObj,
      meta: {},
    };
    return obj;
  }

  @ApiTags('Users')
  @Get('')
  @ApiOperation({ summary: 'Lists users of the platform' })
  @ApiQuery({
    name: 'userStatus',
    type: String,
    description: 'Active, Blocked, All',
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    description: 'Jude Law',
    required: false,
  })
  @ApiQuery({
    name: 'email',
    type: String,
    description: 'kola@gmail.com',
    required: false,
  })
  @ApiQuery({
    name: 'phone',
    type: String,
    description: '+2348173919359',
    required: false,
  })
  @ApiQuery({
    name: 'userid',
    type: String,
    description:
      'ID of user (to be provided if usertype = staff representing distributor)',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    type: String,
    description: 'Retailer/Distributor/Driver/Staff/Admin',
    required: true,
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
    @Query('userStatus') userStatus: string,
    @Query('name') name: string,
    @Query('phone') phone: string,
    @Query('email') email: string,
    @Query('userid') userid: string,
    @Query('type') type: string,
    @Query('limit') limit: number,
    @Query('skip') skip: number,
  ): Promise<ResponseFormat<PaginatedResponse<any>>> {
    if (!type) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: 'Provide Usertype',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      ['RETAILER', 'DISTRIBUTOR', 'DRIVER', 'STAFF', 'ADMIN'].includes(
        type.toUpperCase(),
      ) === false
    ) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: `"type" should be any of these: Retailer|Distributor|Driver|Staff|Admin`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //list accounts

    let fetchRes,
      fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    limit = limit ? Number(limit) : 0;
    skip = skip ? Number(skip) : 0;

    let res: PaginatedResponse<any> = {
      data: [],
      limit,
      skip,
      total: fetchCount,
    };

    let fetchParameters: any = {};
    switch (type.toUpperCase()) {
      case 'STAFF':
        if (userStatus) fetchParameters.status = userStatus;
        if (name) fetchParameters.name = new RegExp(name, 'i');
        if (email) fetchParameters.email = email;
        if (phone) fetchParameters.phone = phone;
        if (userid) fetchParameters.distributorID = userid;
        fetchRes = await this.staffService.get(fetchParameters, skip, limit);
        if (fetchRes.length > 0)
          fetchCount = await this.staffService.countDocuments(fetchParameters);

        res = { ...res, data: fetchRes, total: fetchCount };

        obj = {
          message: 'User Fetched',
          data: res,
          meta: {},
        };
        break;
      case 'DISTRIBUTOR':
        if (userStatus) fetchParameters.status = userStatus;
        if (name) fetchParameters.name = new RegExp(name, 'i');
        if (email) fetchParameters.email = email;
        if (userid) fetchParameters._id = userid;
        if (phone) fetchParameters.phone = phone;
        fetchRes = await this.distributorService.get(
          fetchParameters,
          skip,
          limit,
        );
        if (fetchRes.length > 0)
          fetchCount = await this.distributorService.countDocuments(
            fetchParameters,
          );

        res = { ...res, data: fetchRes, total: fetchCount };

        obj = {
          message: 'User Fetched',
          data: res,
          meta: {},
        };
        break;
      case 'RETAILER':
        if (userStatus) fetchParameters.status = userStatus;

        if (name) fetchParameters.businessName = new RegExp(name, 'i');
        if (email) fetchParameters.email = email;
        if (phone) fetchParameters.phone = phone;
        if (userid) fetchParameters._id = userid;
        fetchRes = await this.retailerService.get(fetchParameters, skip, limit);
        if (fetchRes.length > 0)
          fetchCount = await this.retailerService.countDocuments(
            fetchParameters,
          );

        res = { ...res, data: fetchRes, total: fetchCount };

        obj = {
          message: 'User Fetched',
          data: res,
          meta: {},
        };
        break;
      case 'ADMIN':
        if (userStatus) fetchParameters.status = userStatus;
        if (name) fetchParameters.name = new RegExp(name, 'i');
        if (email) fetchParameters.email = email;
        if (phone) fetchParameters.phone = phone;
        if (userid) fetchParameters._id = userid;
        fetchRes = await this.adminService.get(fetchParameters, skip, limit);
        if (fetchRes.length > 0)
          fetchCount = await this.adminService.countDocuments(fetchParameters);

        res = { ...res, data: fetchRes, total: fetchCount };

        obj = {
          message: 'User Fetched',
          data: res,
          meta: {},
        };
        break;
      case 'DRIVER':
        if (userStatus) fetchParameters.status = userStatus;
        if (name) fetchParameters.name = new RegExp(name, 'i');
        if (email) fetchParameters.email = email;
        if (userid) fetchParameters._id = userid;
        if (phone) fetchParameters.phone = phone;
        fetchRes = await this.driverService.get(fetchParameters, skip, limit);
        if (fetchRes.length > 0)
          fetchCount = await this.driverService.countDocuments(fetchParameters);

        res = { ...res, data: fetchRes, total: fetchCount };

        obj = {
          message: 'User Fetched',
          data: res,
          meta: {},
        };
        break;
    }
    return obj;
  }

  @ApiTags('Push Notification')
  @Post('push-notification/send')
  @ApiOperation({ summary: 'Send Push Notification to user' })
  async sendNotification(@Body() body: PushNotificationField) {
    let user: Retailer | Driver | Distributor;
    let obj: ResponseFormat<string>;

    switch (body.platform.toUpperCase()) {
      case 'DRIVER':
        let res1 = await this.driverService.get({ _id: body.id });
        if (res1) user = res1[0];
        break;
      case 'DISTRIBUTOR':
        let res2 = await this.distributorService.get({ _id: body.id });
        if (res2) user = res2[0];
        break;
      case 'RETAILER':
      default:
        let res3 = await this.retailerService.get({ _id: body.id });
        if (res3) user = res3[0];
        break;
    }

    if (user && user.fcmToken) {
      let token = user.fcmToken;

      //send push notification
      this.pNotiService.send({
        body: body.message,
        title: 'Storedash Update',
        token,
      });
      obj = {
        message: 'Message Sent',
        data: '',
        meta: {},
      };
    } else {
      obj = {
        message: 'Message Not Sent',
        data: '',
        meta: {},
      };
    }

    return obj;
  }
}
