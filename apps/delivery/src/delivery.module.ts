import { DatabaseModule } from '../../../libs/common/src';
import { JWTStrategy } from '../../../libs/common/src/util/authorization/jwt.strategy';
import { AllExceptionsFilter } from '../../../libs/common/src/util/http-exception.filter';
import { PushNotificationService } from '../../../libs/common/src/util/PushNotification/pushNotification';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
import { DeliveryController } from './controller/delivery.controller';
import { VehicleController } from './controller/vehicle.controller';
import { OrderRepository } from './repository/order.repository';
import { VehicleRepository } from './repository/vehicle.repository';
import { Order, OrderSchema } from './schemas/order.schema';
import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { OrderService } from './service/order.service';
import { VehicleService } from './service/vehicle.service';
import { TripService } from './service/trip.service';
import { TripRepository } from './repository/trip.repository';
import { TripController } from './controller/trip.controller';
import { Trip, TripSchema } from './schemas/trip.schema';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
    // ThrottlerModule.forRoot({
    //   ttl: 60,
    //   limit: 30,
    // }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/delivery/.env',
      isGlobal: true,
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Order.name,
        useFactory: () => {
          const schema = OrderSchema;

          return schema;
        },
      },
      {
        name: Vehicle.name,
        useFactory: () => {
          const schema = VehicleSchema;

          return schema;
        },
      },
      {
        name: Trip.name,
        useFactory: () => {
          const schema = TripSchema;

          return schema;
        },
      },
    ]),
  ],
  controllers: [DeliveryController, VehicleController, TripController],
  providers: [
    JWTStrategy,
    OrderService,
    VehicleService,
    TripService,
    PushNotificationService,
    OrderRepository,
    TripRepository,
    VehicleRepository,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class DeliveryModule {}
