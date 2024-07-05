import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Driver } from '../schemas/driver.schema';

@Injectable()
export class DriverRepository extends AbstractRepository<Driver> {
  protected readonly logger = new Logger(DriverRepository.name);

  constructor(
    @InjectModel(Driver.name) driverModel: Model<Driver>,
    @InjectConnection() connection: Connection,
  ) {
    super(driverModel, connection);
  }
}
