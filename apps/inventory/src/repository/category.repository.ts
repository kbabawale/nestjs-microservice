import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Category } from '../schemas/category.schema';

@Injectable()
export class CategoryRepository extends AbstractRepository<Category> {
  protected readonly logger = new Logger(CategoryRepository.name);

  constructor(
    @InjectModel(Category.name) categoryModel: Model<Category>,
    @InjectConnection() connection: Connection,
  ) {
    super(categoryModel, connection);
  }
}
