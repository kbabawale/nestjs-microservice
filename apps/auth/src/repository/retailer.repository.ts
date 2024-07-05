import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Retailer } from '../schemas/retailer.schema';

@Injectable()
export class RetailerRepository extends AbstractRepository<Retailer> {
  protected readonly logger = new Logger(RetailerRepository.name);

  constructor(
    @InjectModel(Retailer.name) retailerModel: Model<Retailer>,
    @InjectConnection() connection: Connection,
  ) {
    super(retailerModel, connection);
  }
}
