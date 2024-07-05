import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Staff } from '../schemas/staff.schema';

@Injectable()
export class StaffRepository extends AbstractRepository<Staff> {
  protected readonly logger = new Logger(StaffRepository.name);

  constructor(
    @InjectModel(Staff.name) staffModel: Model<Staff>,
    @InjectConnection() connection: Connection,
  ) {
    super(staffModel, connection);
  }
}
