import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { VehicleDTO } from '../dto/vehicle.dto';
import { VehicleRepository } from '../repository/vehicle.repository';
import { Vehicle } from '../schemas/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(private readonly vehicleRepository: VehicleRepository) {}

  async create(request: VehicleDTO) {
    try {
      const v = await this.vehicleRepository.create(request);
      return v;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<VehicleDTO>) {
    try {
      const v = await this.vehicleRepository.findOneAndDelete(filterQuery);
      return v;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<VehicleDTO>,
    body: Partial<VehicleDTO>,
  ) {
    try {
      const v = await this.vehicleRepository.findOneAndUpdate(
        filterQuery,
        body,
      );
      return v;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Vehicle>) {
    try {
      return this.vehicleRepository.find(filterQuery);
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
