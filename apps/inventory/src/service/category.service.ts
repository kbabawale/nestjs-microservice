import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { CategoryDTO } from '../dto/category.dto';
import { CategoryRepository } from '../repository/category.repository';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoryService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly categoryRepository: CategoryRepository) {}

  async create(request: Partial<CategoryDTO>, options?: SaveOptions) {
    try {
      const pc = await this.categoryRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Category>) {
    try {
      const pc = await this.categoryRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Category>,
    body: Partial<Category>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.categoryRepository.findOneAndUpdate(
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
    filterQuery?: FilterQuery<Category>,
    skip: number = 0,
    limit: number = 10,
  ) {
    try {
      return this.categoryRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Category>) {
    try {
      return this.categoryRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }
}
