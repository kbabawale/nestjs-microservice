import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { GoogleCountries } from '../schemas/googleCountries.schema';

@Injectable()
export class GoogleCountriesRepository extends AbstractRepository<GoogleCountries> {
  protected readonly logger = new Logger(GoogleCountries.name);

  constructor(
    @InjectModel(GoogleCountries.name) gcModel: Model<GoogleCountries>,
    @InjectConnection() connection: Connection,
  ) {
    super(gcModel, connection);
  }
}
