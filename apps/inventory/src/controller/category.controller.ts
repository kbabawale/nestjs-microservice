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

@Controller('/inventory/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiTags('Category')
  @Post()
  @ApiOperation({ summary: 'Add new product category' })
  async addCategory(
    @Body() request: CategoryDTO,
  ): Promise<ResponseFormat<Category>> {
    //prevent duplicate entries
    let duplicateFound = await this.categoryService.get({
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
          message: 'Product Category already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    let productCategory = await this.categoryService.create(request);

    if (!productCategory) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: productCategory,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<Category> = {
      message: 'Product Category Saved',
      data: productCategory,
    };
    return obj;
  }

  @ApiTags('Category')
  @Get()
  @ApiOperation({ summary: 'Fetch product categories' })
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
    name: 'limit',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'skip',
    type: String,
    required: false,
  })
  async getCategory(
    @Query('id') id: string,
    @Query('name') name: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
  ): Promise<ResponseFormat<PaginatedResponse<Category[]>>> {
    //list requests
    let fetchRes: Category[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let lInt = limit ? Number(limit) : 0;
    let skipInt = skip ? Number(skip) : 0;

    let res: PaginatedResponse<Category[]> = {
      data: [],
      limit: lInt,
      skip: skipInt,
      total: fetchCount,
    };

    let query: FilterQuery<Category> = {};

    if (name) query.name = name;

    if (id) {
      fetchRes = await this.categoryService.get({ _id: id }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.categoryService.countDocuments({ _id: id });
    } else {
      fetchRes = await this.categoryService.get({ ...query }, skipInt, lInt);
      if (fetchRes.length > 0)
        fetchCount = await this.categoryService.countDocuments({ ...query });
    }

    res = { ...res, data: fetchRes, total: fetchCount };

    obj = {
      message: 'Requests Fetched',
      data: res,
      meta: {},
    };

    return obj;
  }

  @ApiTags('Category Dropdown')
  @Get('/dropdown')
  @ApiOperation({ summary: 'Fetch all product categories' })
  async getDropdownCategory(): Promise<ResponseFormat<Category[]>> {
    //list requests
    let fetchRes: Category[];
    let obj: ResponseFormat<Category[]>;

    fetchRes = await this.categoryService.get();

    obj = {
      message: 'Requests Fetched',
      data: fetchRes,
      meta: {},
    };

    return obj;
  }

  @ApiTags('Category')
  @ApiOperation({ summary: 'Deletes A Product Category' })
  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.categoryService.delete({ _id: id });

    let obj: ResponseFormat<boolean> = {
      message: 'Category Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }
}
