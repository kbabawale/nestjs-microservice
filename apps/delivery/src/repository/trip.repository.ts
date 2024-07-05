import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Trip } from '../schemas/trip.schema';

@Injectable()
export class TripRepository extends AbstractRepository<Trip> {
  protected readonly logger = new Logger(TripRepository.name);

  constructor(
    @InjectModel(Trip.name) tripModel: Model<Trip>,
    @InjectConnection() connection: Connection,
  ) {
    super(tripModel, connection);
  }
}
