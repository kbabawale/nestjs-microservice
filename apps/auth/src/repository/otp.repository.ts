import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../../../../libs/common/src';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { OTP } from '../schemas/otp.schemas';

@Injectable()
export class OTPRepository extends AbstractRepository<OTP> {
  protected readonly logger = new Logger(OTPRepository.name);

  constructor(
    @InjectModel(OTP.name) otpModel: Model<OTP>,
    @InjectConnection() connection: Connection,
  ) {
    super(otpModel, connection);
  }
}
