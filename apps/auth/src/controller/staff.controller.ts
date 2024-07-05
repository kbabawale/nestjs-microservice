import { validatePhoneNumber } from '../../../../libs/common/src/util/formatPhone';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../libs/common/src/util/authorization/jwt.guard';
import { StaffService } from '../service/staff.service';
import { StaffDTO, UpdateStaffDTO } from '../dto/staff.dto';
import { Staff } from '../schemas/staff.schema';

@Controller('auth/staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  /**
   * Endpoint generates a default password, sends via SMS, and creates the distributor account.
   */
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Staff')
  @Post('')
  @ApiOperation({ summary: 'Registers A Staff' })
  async addStaff(@Body() request: StaffDTO): Promise<ResponseFormat<Staff>> {
    //set default password
    let defaultPassword: string = this.staffService.generateRandomPassword(
      5,
      3,
      2,
    );
    request = { ...request, password: defaultPassword };

    //prevent duplicate entries
    let duplicateFound = await this.staffService.get({
      $or: [{ email: request.email }, { phone: request.phone }],
    });

    if (duplicateFound.length > 0) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.CONFLICT,
          },
          message: 'Staff already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    //validate and add new Staff
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

    let hashedPassword = await this.staffService.hashPassword(request.password);
    request = { ...request, password: hashedPassword };

    let newStaff = await this.staffService.create(request);

    if (!newStaff) {
      throw new HttpException(
        {
          data: {},
          meta: {
            status: HttpStatus.BAD_REQUEST,
          },
          message: newStaff,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let obj: ResponseFormat<any> = {
      message: 'Staff Account Created',
      data: newStaff,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Staff')
  @Delete(':id')
  @ApiOperation({ summary: 'Deletes A Staff' })
  async deleteStaff(@Param('id') id: string): Promise<ResponseFormat<boolean>> {
    let deleted = await this.staffService.update(
      { _id: id },
      { visible: false },
    );

    let obj: ResponseFormat<boolean> = {
      message: 'Staff Deleted',
      data: true,
      meta: {},
    };
    return obj;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt-auth')
  @ApiTags('Staff')
  @Put(':id')
  @ApiOperation({ summary: 'Updates A Staff' })
  async updateStaff(
    @Param('id') id: string,
    @Body() request: UpdateStaffDTO,
  ): Promise<ResponseFormat<Staff>> {
    let obj: ResponseFormat<Staff>;

    //fetch record
    let recordFound = await this.staffService.get({ _id: id });

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

    //validate and update Staff
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

    //prevent 2 staff from being assigned same vehicle
    if (request.assignedVehicle && request.assignedVehicle.id != '') {
      let findDuplicates = await this.staffService.get({
        assignedVehicle: request.assignedVehicle,
      });
      if (findDuplicates.length > 0) {
        obj = {
          message: 'Vehicle Already Assigned Elsewhere',
          data: null,
          meta: {},
        };
      }
    } else {
      //update db
      let staff = await this.staffService.update({ _id: id }, request);

      obj = {
        message: 'Staff updated',
        data: staff,
        meta: {},
      };
    }

    return obj;
  }
}
