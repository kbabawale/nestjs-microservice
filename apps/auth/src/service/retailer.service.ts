import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { RetailerDTO } from '../dto/retailer.dto';
import { RetailerRepository } from '../repository/retailer.repository';
import { Retailer } from '../schemas/retailer.schema';

@Injectable()
export class RetailerService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(
    private readonly retailerRepository: RetailerRepository,
  ) {}

  

  async create(request: Partial<RetailerDTO>, options?: SaveOptions) {
    try {
      const pc = await this.retailerRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Retailer>) {
    try {
      const pc = await this.retailerRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Retailer>,
    body: Partial<Retailer>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.retailerRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Retailer>, skip = 0, limit = 10) {
    return this.retailerRepository.find(filterQuery, skip, limit);
  }

  async countDocuments(filterQuery?: FilterQuery<Retailer>) {
    return this.retailerRepository.countDoc(filterQuery);
  }

}
