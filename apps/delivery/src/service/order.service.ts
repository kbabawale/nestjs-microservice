import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FilterQuery, QueryOptions, SaveOptions } from 'mongoose';
import { OrderDTO } from '../dto/order.dto';
import { OrderRepository } from '../repository/order.repository';
import { Order } from '../schemas/order.schema';
import axios from 'axios';
import { ResponseFormat } from '../../../../libs/common/src/util/response';
@Injectable()
export class OrderService {
  @Inject(ConfigService)
  public config: ConfigService;

  constructor(private readonly orderRepository: OrderRepository) {}

  async create(request: Partial<OrderDTO>, options?: SaveOptions) {
    try {
      const pc = await this.orderRepository.create(request, options);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<Order>) {
    try {
      const pc = await this.orderRepository.findOneAndDelete(filterQuery);
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<Order>,
    body: Partial<Order>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.orderRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<Order>, skip = 0, limit = 10) {
    try {
      return this.orderRepository.find(filterQuery, skip, limit);
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<Order>) {
    try {
      return this.orderRepository.countDoc(filterQuery);
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

  async putExternal<T, U = any>(
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

      let { data, status } = await axios.put<ResponseFormat<T, U>>(
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
