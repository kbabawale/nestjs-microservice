import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DriverRepository } from '../repository/driver.repository';
import { AdminService } from './admin.service';
import { DistributorService } from './distributor.service';
import { RetailerService } from './retailer.service';


@Injectable()
export class AuthService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(
    private readonly driverRepository: DriverRepository,
    private readonly retailerService: RetailerService,
    private readonly distributorService: DistributorService,
    private readonly adminService: AdminService,
  ) {}

  

  async isRegistered(platform: string, field: any) {
    let response: {
      status: boolean;
      user_id: Types.ObjectId | string;
    };
    switch (platform.toUpperCase()) {
      case 'RETAILER':
        const retailer = await this.retailerService.get(field);
        response = {
          status: retailer.length > 0 ? true : false,
          user_id: retailer.length > 0 ? retailer[0]._id : '',
        };
        break;
      case 'DRIVER':
        const driver = await this.driverRepository.find(field);
        response = {
          status: driver.length > 0 ? true : false,
          user_id: driver.length > 0 ? driver[0]._id : '',
        };
        break;
      case 'DISTRIBUTOR':
        const distro = await this.distributorService.get(field);
        response = {
          status: distro.length > 0 ? true : false,
          user_id: distro.length > 0 ? distro[0]._id : '',
        };
        break;
      case 'ADMIN':
        const admin = await this.adminService.get(field);
        response = {
          status: admin.length > 0 ? true : false,
          user_id: admin.length > 0 ? admin[0]._id : '',
        };
        break;
    }
    return response;
  }
}
