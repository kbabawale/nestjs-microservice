import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { BrandDTO } from '../dto/brand.dto';
import { BrandRepository } from '../repository/brand.repository';
import { Brand } from '../schemas/brand.schema';
import { Category } from '../schemas/category.schema';

@Injectable()
export class BrandService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly brandRepository: BrandRepository) {}

  async create(request: Partial<BrandDTO>, options?: SaveOptions) {
    try {
      const pc = await this.brandRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Category>) {
    try {
      const pc = await this.brandRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Brand>,
    body: Partial<Brand>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.brandRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(
    filterQuery?: FilterQuery<Brand>,
    skip: number = 0,
    limit: number = 10,
  ) {
    try {
      return this.brandRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Brand>) {
    try {
      return this.brandRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }
}
