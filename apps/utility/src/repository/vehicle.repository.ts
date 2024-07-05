import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Vehicle } from '../schemas/vehicle.schema';

@Injectable()
export class VehicleRepository extends AbstractRepository<Vehicle> {
  protected readonly logger = new Logger(Vehicle.name);

  constructor(
    @InjectModel(Vehicle.name) vehicleModel: Model<Vehicle>,
    @InjectConnection() connection: Connection,
  ) {
    super(vehicleModel, connection);
  }
}
