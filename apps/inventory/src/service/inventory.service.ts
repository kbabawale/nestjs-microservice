import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { InventoryDTO } from '../dto/inventory.dto';
import { InventoryRepository } from '../repository/inventory.repository';
import { Inventory } from '../schemas/inventory.schema';
@Injectable()
export class InventoryService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async create(request: Partial<InventoryDTO>, options?: SaveOptions) {
    try {
      const pc = await this.inventoryRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Inventory>) {
    try {
      const pc = await this.inventoryRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Inventory>,
    body: Partial<Inventory>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.inventoryRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Inventory>, skip = 0, limit = 10) {
    try {
      return this.inventoryRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Inventory>) {
    try {
      return this.inventoryRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }

  async fetchDistinct(field: string) {
    try {
      return this.inventoryRepository.findDistinct(field);
    } catch (err) {
      throw err;
    }
  }

  async fetchAggregate(field: any) {
    try {
      return this.inventoryRepository.fetchAggregate(field);
    } catch (err) {
      throw err;
    }
  }
}
