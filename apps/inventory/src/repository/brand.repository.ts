import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Brand } from '../schemas/brand.schema';

@Injectable()
export class BrandRepository extends AbstractRepository<Brand> {
  protected readonly logger = new Logger(BrandRepository.name);

  constructor(
    @InjectModel(Brand.name) brandModel: Model<Brand>,
    @InjectConnection() connection: Connection,
  ) {
    super(brandModel, connection);
  }
}
