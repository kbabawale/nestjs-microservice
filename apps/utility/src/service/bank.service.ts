import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { BankDTO } from '../dto/bank.dto';
import { BankRepository } from '../repository/bank.repository';
import { Bank } from '../schemas/bank.schema';

@Injectable()
export class BankService {
  constructor(private readonly bankRepository: BankRepository) {}

  async create(request: BankDTO) {
    try {
      const bank = await this.bankRepository.create(request);
      return bank;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Bank>) {
    try {
      const bank = await this.bankRepository.findOneAndDelete(filterQuery);
      return bank;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Bank>) {
    try {
      return this.bankRepository.find({});
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Bank>) {
    try {
      return this.bankRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }
}
