import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Bank } from '../schemas/bank.schema';

@Injectable()
export class BankRepository extends AbstractRepository<Bank> {
  protected readonly logger = new Logger(BankRepository.name);

  constructor(
    @InjectModel(Bank.name) bankModel: Model<Bank>,
    @InjectConnection() connection: Connection,
  ) {
    super(bankModel, connection);
  }
}
