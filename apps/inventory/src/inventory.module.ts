import { DatabaseModule } from '../../../libs/common/src';
import { Module } from '@nestjs/common';
import { InventoryController } from './controller/inventory.controller';
import { InventoryService } from './service/inventory.service';
import { InventoryRepository } from './repository/inventory.repository';
import * as Joi from 'joi';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '../../../libs/common/src/util/http-exception.filter';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from '../../../libs/common/src/util/authorization/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { Category, CategorySchema } from './schemas/category.schema';
import { CategoryService } from './service/category.service';
import { CategoryRepository } from './repository/category.repository';
import { CategoryController } from './controller/category.controller';
import { Brand, BrandSchema } from './schemas/brand.schema';
import { BrandService } from './service/brand.service';
import { BrandRepository } from './repository/brand.repository';
import { BrandController } from './controller/brand.controller';

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
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 50,
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
      envFilePath: './apps/inventory/.env',
      isGlobal: true,
    }),
    MongooseModule.forFeatureAsync([
      {
        name: Inventory.name,
        useFactory: () => {
          const schema = InventorySchema;
          return schema;
        },
      },
      {
        name: Category.name,
        useFactory: () => {
          const schema = CategorySchema;
          return schema;
        },
      },
      {
        name: Brand.name,
        useFactory: () => {
          const schema = BrandSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [InventoryController, CategoryController, BrandController],
  providers: [
    InventoryService,
    CategoryService,
    BrandService,
    InventoryRepository,
    BrandRepository,
    CategoryRepository,
    JWTStrategy,
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
export class InventoryModule {}
