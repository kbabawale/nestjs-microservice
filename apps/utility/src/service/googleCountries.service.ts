import { Injectable } from '@nestjs/common';
import { FilterQuery } from 'mongoose';
import { GoogleCountriesDTO } from '../dto/googleCountries.dto';
import { GoogleCountriesRepository } from '../repository/googleCountries.repository';
import { GoogleCountries } from '../schemas/googleCountries.schema';

@Injectable()
export class GCService {
  constructor(private readonly gcRepository: GoogleCountriesRepository) {}

  async create(request: GoogleCountriesDTO) {
    try {
      const gc = await this.gcRepository.create(request);
      return gc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<GoogleCountries>) {
    try {
      const gc = await this.gcRepository.findOneAndDelete(filterQuery);
      return gc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<GoogleCountries>) {
    try {
      return this.gcRepository.find({});
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<GoogleCountries>) {
    try {
      return this.gcRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<GoogleCountriesDTO>,
    body: Partial<GoogleCountriesDTO>,
  ) {
    try {
      const v = await this.gcRepository.findOneAndUpdate(filterQuery, body);
      return v;
    } catch (err) {
      throw err;
    }
  }
}
