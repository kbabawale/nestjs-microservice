import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Role } from '../schemas/role.schema';

@Injectable()
export class RoleRepository extends AbstractRepository<Role> {
  protected readonly logger = new Logger(RoleRepository.name);

  constructor(
    @InjectModel(Role.name) roleModel: Model<Role>,
    @InjectConnection() connection: Connection,
  ) {
    super(roleModel, connection);
  }
}
