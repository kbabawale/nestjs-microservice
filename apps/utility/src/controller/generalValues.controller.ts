import { ResponseFormat } from '../../../../libs/common/src/util/response';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CloudinaryDelete, GeneralValuesDTO } from '../dto/generalValues.dto';
import { GeneralValues } from '../schemas/generalValues.schema';
import { GeneralValuesService } from '../service/generalValues.service';
import { generateSignature } from '../../../../libs/common/src/util/cloudinary';

@Controller('storedash/general')
export class GeneralValuesController {
  constructor(private readonly gsService: GeneralValuesService) {}

  @Post()
  @ApiTags('GeneralValues')
  @ApiOperation({ summary: 'Adds new general value' })
  async add(
    @Body() request: GeneralValuesDTO,
  ): Promise<ResponseFormat<GeneralValues>> {
    let gs: GeneralValues = await this.gsService.create(request);
    let gsCount: number = await this.gsService.countDocuments();

    let obj: ResponseFormat<any> = {
      message: 'GS Added',
      data: gs,
      meta: {
        count: gsCount,
      },
    };
    return obj;
  }

  @Get()
  @ApiTags('GeneralValues')
  @ApiOperation({ summary: '' })
  async get() {
    let list = await this.gsService.get();
    let obj: ResponseFormat<any> = {
      message: 'General Values',
      data: list,
    };
    return obj;
  }

  @Get('distance/calculate')
  @ApiTags('Google')
  @ApiQuery({
    name: 'originlat',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'originlng',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'destinationlat',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'destinationlng',
    type: Number,
    required: true,
  })
  @ApiOperation({ summary: 'Calculates distance between 2 coordinates' })
  async calculateDistance(
    @Query('originlat') originlat: number,
    @Query('originlng') originlng: number,
    @Query('destinationlat') destinationlat: number,
    @Query('destinationlng') destinationlng: number,
  ) {
    let list = await this.gsService.calculateDistance(
      { lat: originlat, lng: originlng },
      { lat: destinationlat, lng: destinationlng },
    );

    let obj: ResponseFormat<any> = {
      message: 'Distance Retrieved',
      data: list.distance,
      meta: {
        duration: list.duration,
      },
    };
    return obj;
  }

  @Get('geocode')
  @ApiTags('Google')
  @ApiQuery({
    name: 'address',
    type: String,
    required: true,
  })
  @ApiOperation({ summary: 'Returns coordinates for an address' })
  async convertToCoordinates(
    @Query('address') address: string,
  ): Promise<ResponseFormat<{ placeID: string; lat: number; lng: number }>> {
    let list = await this.gsService.convertToCoordinates(address);

    let obj: ResponseFormat<any> = {
      message: 'Coordinates Retrieved',
      data: list,
    };
    return obj;
  }

  @Get('address/fetch')
  @ApiTags('Google')
  @ApiQuery({
    name: 'lat',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'lng',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'place_id',
    type: String,
    required: false,
  })
  @ApiOperation({ summary: 'Returns address for given coordinates' })
  async convertToAddress(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('place_id') place_id: string,
  ): Promise<ResponseFormat<{ place: string }>> {
    let list;
    if (place_id.length > 0) {
      list = await this.gsService.convertToAddressPlace(place_id);
    } else {
      list = await this.gsService.convertToAddress(lat, lng);
    }

    let obj: ResponseFormat<any> = {
      message: 'Address Retrieved',
      data: list.place,
    };
    return obj;
  }

  @Put(':utilitytype')
  @ApiTags('GeneralValues')
  @ApiOperation({ summary: 'Updates a general service' })
  async updateOne(
    @Param('utilitytype') utilitytype: string,
    @Body() body: GeneralValuesDTO,
  ): Promise<ResponseFormat<GeneralValues>> {
    let recordFound = await this.gsService.get({ name: utilitytype });

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

    let updated = await this.gsService.update({ name: utilitytype }, body);

    let obj: ResponseFormat<any> = {
      message: 'Retailer updated',
      data: updated,
      meta: {},
    };
    return obj;
  }

  @Get('cloudinary/signature')
  @ApiTags('Cloudinary')
  @ApiOperation({ summary: 'Returns cloudinary signature and timestamp' })
  async generateCloudinarySignature(): Promise<
    ResponseFormat<{ timestamp: number; signature: string }>
  > {
    const { signature, timestamp } = generateSignature();

    let obj: ResponseFormat<{ timestamp: number; signature: string }> = {
      message: 'Signature Retrieved',
      data: {
        timestamp,
        signature,
      },
    };
    return obj;
  }

  @Post('cloudinary/asset/delete')
  @ApiTags('Cloudinary')
  @ApiOperation({ summary: 'Deletes cloudinary asset' })
  async deleteCloudinaryAsset(
    @Body() request: CloudinaryDelete,
  ): Promise<ResponseFormat<any>> {
    const cloudinary = require('cloudinary').v2;

    const result: { result: string } = await cloudinary.uploader.destroy(
      request.public_id,
      {
        api_secret: 'redacted',
        api_key: 'redacted',
        cloud_name: 'redacted',
      },
    );

    let obj: ResponseFormat<any> = {
      message: 'Asset Deleted',
      data: false,
    };

    if (result.result.toLowerCase() === 'ok') {
      obj = { ...obj, data: true };
    }

    return obj;
  }
}
