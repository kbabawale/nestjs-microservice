import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';

import { DistributorRepository } from '../repository/distributor.repository';
import { DistributorDTO } from '../dto/distributor.dto';
import { Distributor } from '../schemas/distributor.schema';
@Injectable()
export class DistributorService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly distributorRepository: DistributorRepository) {}

  async create(request: Partial<DistributorDTO>, options?: SaveOptions) {
    try {
      const pc = await this.distributorRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Distributor>) {
    try {
      const pc = await this.distributorRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Distributor>,
    body: Partial<Distributor>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.distributorRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Distributor>, skip = 0, limit = 10) {
    try {
      return this.distributorRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Distributor>) {
    try {
      return this.distributorRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }

}
