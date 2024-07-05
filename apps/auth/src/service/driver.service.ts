import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { DriverRepository } from '../repository/driver.repository';
import { Driver } from '../schemas/driver.schema';

@Injectable()
export class DriverService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly driverRepository: DriverRepository) {}

  


  async create(request: Partial<Driver>, options?: SaveOptions) {
    try {
      const pc = await this.driverRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Driver>) {
    try {
      const pc = await this.driverRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Driver>,
    body: Partial<Driver>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.driverRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Driver>, skip = 0, limit = 10) {
    try {
      return this.driverRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Driver>) {
    try {
      return this.driverRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }

  
}
