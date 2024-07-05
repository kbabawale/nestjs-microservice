import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import axios from 'axios';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
import { TripRepository } from '../repository/trip.repository';
import { TripDTO } from '../dto/trip.dto';
import { Trip } from '../schemas/trip.schema';

@Injectable()
export class TripService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly tripRepository: TripRepository) {}

  async create(request: Partial<TripDTO>, options?: SaveOptions) {
    try {
      const pc = await this.tripRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Trip>) {
    try {
      const pc = await this.tripRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Trip>,
    body: Partial<Trip>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.tripRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Trip>, skip = 0, limit = 10) {
    try {
      return this.tripRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Trip>) {
    try {
      return this.tripRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }

  async getExternal<T, U = any>(
    url: string,
    token: string,
  ): Promise<ResponseFormat<T, U> | boolean> {
    try {
      let options = {
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      };

      let { data, status } = await axios.get<ResponseFormat<T, U>>(
        url,
        options,
      );

      if (status != 200) {
        return false;
      } else {
        return data;
      }
    } catch (err) {}
  }

  async postExternal<T, U = any>(
    url: string,
    body: any,
    token: string,
  ): Promise<ResponseFormat<T, U> | boolean> {
    try {
      let options = {
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      };

      let { data, status } = await axios.post<ResponseFormat<T, U>>(
        url,
        body,
        options,
      );

      if (status != 200) {
        return false;
      } else {
        return data;
      }
    } catch (err) {}
  }
}
