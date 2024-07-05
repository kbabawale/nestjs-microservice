import { ResponseFormat } from '../../../../libs/common/src/util/response';
import { PaginatedResponse } from '../../../../libs/common/src/util/util';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { CategoryDTO } from '../dto/category.dto';
import { Category } from '../schemas/category.schema';
import { CategoryService } from '../service/category.service';
import { BrandService } from '../service/brand.service';
import { BrandDTO } from '../dto/brand.dto';
import { Brand } from '../schemas/brand.schema';

@Controller('/inventory/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @ApiTags('Brand')
  @Post()
  @ApiOperation({ summary: 'Add new brand' })
  async addBrand(@Body() request: BrandDTO): Promise<ResponseFormat<Brand>> {
    //prevent duplicate entries
    let duplicateFound = await this.brandService.get({
      name: request.name,
    });

    //insert new product
    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Product Brand already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    let brandCategory = await this.brandService.create(request);

    if (!brandCategory) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: brandCategory,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<Brand> = {
      message: 'Product Brand Saved',
      data: brandCategory,
    };
    return obj;
  }

  @ApiTags('Brand')
  @Get()
  @ApiOperation({ summary: 'Fetch product brand' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'country',
    type: String,
    required: false,
  })
  async getBrand(
    @Query('id') id: string,
    @Query('name') name: string,
    @Query('country') country: string,
  ): Promise<ResponseFormat<Brand[]>> {
    //list requests
    let fetchRes: Brand[];
    let obj: ResponseFormat<Brand[]>;

    let query: FilterQuery<Brand> = {};

    if (name) query.name = name;
    if (country) query.country = country;

    if (id) {
      fetchRes = await this.brandService.get({ _id: id });
    } else {
      fetchRes = await this.brandService.get({ ...query });
    }

    obj = {
      message: 'Requests Fetched',
      data: fetchRes,
      meta: {},
    };

    return obj;
  }

  @ApiTags('Brand')
  @ApiOperation({ summary: 'Deletes A Product Brand' })
  @Delete(':id')
  async deleteBrand(@Param('id') id: string): Promise<ResponseFormat<boolean>> {
    await this.brandService.delete({ _id: id });

    let obj: ResponseFormat<boolean> = {
      message: 'Brand Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }
}
