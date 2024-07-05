import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Inventory } from '../schemas/inventory.schema';

@Injectable()
export class InventoryRepository extends AbstractRepository<Inventory> {
  protected readonly logger = new Logger(InventoryRepository.name);

  constructor(
    @InjectModel(Inventory.name) inventoryModel: Model<Inventory>,
    @InjectConnection() connection: Connection,
  ) {
    super(inventoryModel, connection);
  }
}
