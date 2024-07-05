import { DatabaseModule } from '../../../libs/common/src';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { Bank, BankSchema } from './schemas/bank.schema';

import { Vehicle, VehicleSchema } from './schemas/vehicle.schema';
import { BankController } from './controller/bank.controller';
import { BankService } from './service/bank.service';
import { BankRepository } from './repository/bank.repository';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AllExceptionsFilter } from '../../../libs/common/src/util/http-exception.filter';
import { VehicleService } from './service/vehicle.service';
import { VehicleRepository } from './repository/vehicle.repository';
import { VehicleController } from './controller/vehicle.controller';
import { FeedbackController } from './controller/feedback.controller';
import {
  GeneralValues,
  GeneralValuesSchema,
} from './schemas/generalValues.schema';
import { GeneralValuesController } from './controller/generalValues.controller';
import { GeneralValuesRepository } from './repository/generalValues.repository';
import { GeneralValuesService } from './service/generalValues.service';
import {
  GoogleCountries,
  GoogleCountriesSchema,
} from './schemas/googleCountries.schema';
import { GoogleCountriesController } from './controller/googleCountries.controller';
import { GCService } from './service/googleCountries.service';
import { GoogleCountriesRepository } from './repository/googleCountries.repository';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 30,
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/utility/.env',
      isGlobal: true,
    }),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Bank.name, schema: BankSchema },
      { name: Vehicle.name, schema: VehicleSchema },
      { name: GeneralValues.name, schema: GeneralValuesSchema },
    
      { name: GoogleCountries.name, schema: GoogleCountriesSchema },
    ]),
  ],
  controllers: [
    BankController,
    VehicleController,
    FeedbackController,
    GeneralValuesController,

    GoogleCountriesController,
  ],
  providers: [
    BankService,

    GCService,
    GoogleCountriesRepository,

    BankRepository,
    GeneralValuesRepository,
    GeneralValuesService,
    VehicleService,
    VehicleRepository,
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
export class UtilityModule {}
