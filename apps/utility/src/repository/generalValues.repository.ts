import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { GeneralValues } from '../schemas/generalValues.schema';

@Injectable()
export class GeneralValuesRepository extends AbstractRepository<GeneralValues> {
  protected readonly logger = new Logger(GeneralValuesRepository.name);

  constructor(
    @InjectModel(GeneralValues.name) generalValuesModel: Model<GeneralValues>,
    @InjectConnection() connection: Connection,
  ) {
    super(generalValuesModel, connection);
  }
}
