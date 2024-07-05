import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Distributor } from '../schemas/distributor.schema';

@Injectable()
export class DistributorRepository extends AbstractRepository<Distributor> {
  protected readonly logger = new Logger(DistributorRepository.name);

  constructor(
    @InjectModel(Distributor.name) distributorModel: Model<Distributor>,
    @InjectConnection() connection: Connection,
  ) {
    super(distributorModel, connection);
  }
}
