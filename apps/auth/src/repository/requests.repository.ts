import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { AdminRequests } from '../schemas/requests.schema.';

@Injectable()
export class RequestsRepository extends AbstractRepository<AdminRequests> {
  protected readonly logger = new Logger(RequestsRepository.name);

  constructor(
    @InjectModel(AdminRequests.name) requestsModel: Model<AdminRequests>,
    @InjectConnection() connection: Connection,
  ) {
    super(requestsModel, connection);
  }
}
