import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
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
import { FilterQuery } from 'mongoose';
import { AltInventoryDTO, InventoryDTO } from '../dto/inventory.dto';
import { Inventory } from '../schemas/inventory.schema';
import { CategoryService } from '../service/category.service';
import { InventoryService } from '../service/inventory.service';
import { BrandService } from '../service/brand.service';

@Controller()
export class InventoryController {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly categoryService: CategoryService,
    private readonly brandService: BrandService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Products')
  @Post('inventory')
  @ApiOperation({ summary: 'Add new product' })
  async addProduct(
    @Body() request: InventoryDTO,
  ): Promise<ResponseFormat<Inventory>> {
    //prevent duplicate entries
    let duplicateFound = await this.inventoryService.get({
      $or: [
        { name: request.name },
        { nafdacRegistration: request.nafdacRegistration },
        { sku: request.sku },
      ],
    });

    //validate product category
    let categoryFound = await this.categoryService.get({
      name: request.category,
    });

    //insert new product
    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Product already exists',
        },
        HttpStatus.CONFLICT,
      );
    }
    //prevent category if not in system already
    if (categoryFound.length == 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Invalid Product Category',
        },
        HttpStatus.CONFLICT,
      );
    }

    let product = await this.inventoryService.create(request);

    if (!product) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: product,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //save manufacturer info in db if not exists
    if (request.manufacturer) {
      let brandDuplicateFound = await this.brandService.get({
        name: new RegExp(request.manufacturer.name, 'i'),
      });
      if (brandDuplicateFound.length === 0) {
        await this.brandService.create(request.manufacturer);
      }
    }

    let obj: ResponseFormat<Inventory> = {
      message: 'Product Saved',
      data: product,
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Products')
  @Get('inventory')
  @ApiOperation({ summary: 'Fetch product(s)' })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'sale',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'published',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'category',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'stockCount',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'SKU',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'manufacturer',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'distributor',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'distributorID',
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
  async getProduct(
    @Query('id') id: string,
    @Query('name') name: string,
    @Query('category') category: string,
    @Query('stockCount') stockCount: string,
    @Query('sale') sale: boolean,
    @Query('published') published: boolean,
    @Query('manufacturer') manufacturer: string,
    @Query('distributor') distributor: string,
    @Query('distributorID') distributorID: string,
    @Query('SKU') SKU: string,
    @Query('limit') limit: string,
    @Query('skip') skip: string,
  ): Promise<ResponseFormat<PaginatedResponse<Inventory[]>>> {
    //list requests
    let fetchRes: Inventory[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let lInt = limit ? Number(limit) : 0;
    let skipInt = skip ? Number(skip) : 0;

    let res: PaginatedResponse<Inventory[]> = {
      data: [],
      limit: lInt,
      skip: skipInt,
      total: fetchCount,
    };

    let query: FilterQuery<Inventory> = {};

    if (name) query.name = new RegExp(name, 'i');
    if (category) query.category = new RegExp(category, 'i');
    if (stockCount) query.stockCount = stockCount;
    if (manufacturer)
      query['manufacturer.name'] = new RegExp(manufacturer, 'i');
    if (distributor) query['distributor.name'] = new RegExp(distributor, 'i');
    if (distributorID) query['distributor.id'] = distributorID;
    if (sale) query['price.sale'] = sale;
    if (sale) query['price.sale'] = query['price.sale'] === 'true';
    if (published) query.published = published;
    if (published) query.published = query.published === 'true';
    if (SKU) query.sku = new RegExp(SKU, 'i');

    if (id) {
      fetchRes = await this.inventoryService.get(
        { status: 'Active', _id: id },
        skipInt,
        lInt,
      );
      if (fetchRes.length > 0)
        fetchCount = await this.inventoryService.countDocuments({
          status: 'Active',
          _id: id,
        });
    } else {
      fetchRes = await this.inventoryService.get(
        { status: 'Active', ...query },
        skipInt,
        lInt,
      );
      if (fetchRes.length > 0)
        fetchCount = await this.inventoryService.countDocuments({
          status: 'Active',
          ...query,
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
  @ApiTags('Products')
  @Get('inventory/low-stock/count')
  @ApiOperation({
    summary: 'Detect if low stock count of products per distributor exist',
  })
  @ApiQuery({
    name: 'distributorID',
    type: String,
    required: false,
  })
  async detectLowCount(
    @Query('distributorID') distributorID: string,
  ): Promise<ResponseFormat<boolean>> {
    if (!distributorID) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.NOT_ACCEPTABLE,
          },
          message: 'Provide Distributor ID',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    let obj: ResponseFormat<boolean>;

    let query: FilterQuery<Inventory> = {};

    if (distributorID) query['distributor.id'] = distributorID;

    let fetchRes = await this.inventoryService.get({
      status: 'Active',
      ...query,
    });

    let lowStock = fetchRes.some((x) => x.stockCount < 5);

    obj = {
      message: 'Requests Fetched',
      data: lowStock,
      meta: {},
    };

    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Products')
  @Get('inventory/search')
  @ApiOperation({ summary: 'Search product(s)' })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
  })
  async searchProducts(
    @Query('name') name: string,
  ): Promise<ResponseFormat<PaginatedResponse<Inventory[]>>> {
    let fetchRes: Inventory[];
    let fetchCount = 0;
    let obj: ResponseFormat<PaginatedResponse<any>>;

    let res: PaginatedResponse<Inventory[]> = {
      data: [],
      limit: 0,
      skip: 0,
      total: fetchCount,
    };

    ///search through name, category, manufacturer names
    fetchRes = await this.inventoryService.get({
      status: 'Active',
      published: true,
      $or: [
        { name: new RegExp(name, 'i') },
        { description: new RegExp(name, 'i') },
        { 'manufacturer.name': new RegExp(name, 'i') },
        { category: new RegExp(name, 'i') },
        { tag: new RegExp(name, 'i') },
      ],
    });
    if (fetchRes.length > 0)
      fetchCount = await this.inventoryService.countDocuments({
        status: 'Active',
        published: true,
        $or: [
          { name: new RegExp(name, 'i') },
          { description: new RegExp(name, 'i') },
          { 'manufacturer.name': new RegExp(name, 'i') },
          { category: new RegExp(name, 'i') },
          { tag: new RegExp(name, 'i') },
        ],
      });

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
  @ApiTags('Products')
  @ApiOperation({ summary: 'Updates A Product' })
  @Put('inventory/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() request: AltInventoryDTO,
  ): Promise<ResponseFormat<Inventory>> {
    //fetch record
    let recordFound = await this.inventoryService.get({ _id: id });

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

    //update db
    let updated = await this.inventoryService.update({ _id: id }, request);

    let obj: ResponseFormat<Inventory> = {
      message: 'Inventory updated',
      data: updated,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Products')
  @ApiOperation({ summary: 'Deletes A Product' })
  @Delete('inventory/:id')
  async deleteInventory(
    @Param('id') id: string,
  ): Promise<ResponseFormat<boolean>> {
    let deleted = await this.inventoryService.delete({ _id: id });

    let obj: ResponseFormat<boolean> = {
      message: 'Inventory Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }
}
