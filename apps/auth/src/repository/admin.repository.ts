import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Adminn } from '../schemas/admin.schema';

@Injectable()
export class AdminnRepository extends AbstractRepository<Adminn> {
  protected readonly logger = new Logger(AdminnRepository.name);

  constructor(
    @InjectModel(Adminn.name) adminModel: Model<Adminn>,
    @InjectConnection() connection: Connection,
  ) {
    super(adminModel, connection);
  }
}
