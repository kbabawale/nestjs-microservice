import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { VehicleDTO } from '../dto/vehicle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';
import { Vehicle } from '../schemas/vehicle.schema';

@Injectable()
export class VehicleService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(request: Partial<VehicleDTO>, options?: SaveOptions) {
    try {
      const pc = await this.vehicleRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Vehicle>) {
    try {
      const pc = await this.vehicleRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Vehicle>,
    body: Partial<Vehicle>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.vehicleRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Vehicle>, skip = 0, limit = 10) {
    try {
      return this.vehicleRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Vehicle>) {
    try {
      return this.vehicleRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }
}
