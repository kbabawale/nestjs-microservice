import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { AdminnRepository } from '../repository/admin.repository';
import { AdminDTO } from '../dto/admin.dto';
import { Adminn } from '../schemas/admin.schema';

@Injectable()
export class AdminService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly adminRepository: AdminnRepository) {}

  async create(request: Partial<AdminDTO>, options?: SaveOptions) {
    try {
      const pc = await this.adminRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Adminn>) {
    try {
      const pc = await this.adminRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Adminn>,
    body: Partial<Adminn>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.adminRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Adminn>, skip = 0, limit = 10) {
    return this.adminRepository.find(filterQuery, skip, limit);
  }

  async countDocuments(filterQuery?: FilterQuery<Adminn>) {
    return this.adminRepository.countDoc(filterQuery);
  }

  
}
