import { DatabaseModule } from '../../../libs/common/src';
import { AllExceptionsFilter } from '../../../libs/common/src/util/http-exception.filter';
import { HttpModule } from '@nestjs/axios';
import {  Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { AuthController } from './controller/auth.controller';
import { AdminnRepository } from './repository/admin.repository';
import { DistributorRepository } from './repository/distributor.repository';
import { DriverRepository } from './repository/driver.repository';
import { RetailerRepository } from './repository/retailer.repository';
import { Adminn, AdminnSchema } from './schemas/admin.schema';
import { Distributor, DistributorSchema } from './schemas/distributor.schema';
import { Driver, DriverSchema } from './schemas/driver.schema';
import { Retailer, RetailerSchema } from './schemas/retailer.schema';
import { RetailerService } from './service/retailer.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from '../../../libs/common/src/util/authorization/jwt.strategy';
import { RetailerController } from './controller/retailer.controller';
import { DriverController } from './controller/driver.controller';
import { PushNotificationService } from '../../../libs/common/src/util/PushNotification/pushNotification';
import { DriverService } from './service/driver.service';
import { AuthService } from './service/auth.service';
import { DistributorService } from './service/distributor.service';
import { DistributorController } from './controller/distributor.controller';
import { AdminController } from './controller/admin.controller';
import { AdminRequests, RequestsSchema } from './schemas/requests.schema.';

import { StaffRepository } from './repository/staff.repository';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { AdminService } from './service/admin.service';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    MailerModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: true,
          port: 465,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `<${config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'), //default host
        port: configService.get('REDIS_PORT'), //default port
      }),
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/auth/.env',
      isGlobal: true,
    }),
    DatabaseModule,
    MongooseModule.forFeatureAsync([
      {
        name: Retailer.name,
        useFactory: () => {
          const schema = RetailerSchema;

          return schema;
        },
      },
      {
        name: Distributor.name,
        useFactory: () => {
          const schema = DistributorSchema;

          return schema;
        },
      },
      {
        name: Driver.name,
        useFactory: () => {
          const schema = DriverSchema;

          return schema;
        },
      },
      
      {
        name: Adminn.name,
        useFactory: () => {
          const schema = AdminnSchema;

          return schema;
        },
      },
      {
        name: AdminRequests.name,
        useFactory: () => {
          const schema = RequestsSchema;

          return schema;
        },
      }
    ]),
  ],
  controllers: [
    AuthController,
    RetailerController,
    DistributorController,
    DriverController,
    AdminController,
  ],
  providers: [
    JWTStrategy,
    RetailerService,
    AuthService,
    AdminService,
    DriverService,
    DistributorService,
    PushNotificationService,
    AdminnRepository,
    StaffRepository,
    DistributorRepository,
    RetailerRepository,
    DriverRepository,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AuthModule {}
