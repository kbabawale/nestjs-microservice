import { Inject, Injectable } from '@nestjs/common';
import { FilterQuery, QueryOptions } from 'mongoose';
import { GeneralValuesDTO } from '../dto/generalValues.dto';
import { GeneralValuesRepository } from '../repository/generalValues.repository';
import { GeneralValues } from '../schemas/generalValues.schema';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GeneralValuesService {
  constructor(
    @Inject(ConfigService)
    public config: ConfigService,
    private readonly generalValuesRepository: GeneralValuesRepository,
  ) {}

  async create(request: GeneralValuesDTO) {
    try {
      const bank = await this.generalValuesRepository.create(request);
      return bank;
    } catch (err) {
      throw err;
    }
  }

  async update(
    filterQuery: FilterQuery<GeneralValues>,
    body: Partial<GeneralValues>,
    options?: QueryOptions,
  ) {
    try {
      const pc = await this.generalValuesRepository.findOneAndUpdate(
        filterQuery,
        body,
        options,
      );
      return pc;
    } catch (err) {
      throw err;
    }
  }

  async delete(filterQuery?: FilterQuery<GeneralValues>) {
    try {
      const bank = await this.generalValuesRepository.findOneAndDelete(
        filterQuery,
      );
      return bank;
    } catch (err) {
      throw err;
    }
  }

  async get(filterQuery?: FilterQuery<GeneralValues>) {
    try {
      return this.generalValuesRepository.find({});
    } catch (err) {
      throw err;
    }
  }

  async countDocuments(filterQuery?: FilterQuery<GeneralValues>) {
    try {
      return this.generalValuesRepository.countDoc(filterQuery);
    } catch (err) {
      throw err;
    }
  }

  async calculateDistance(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) {
    try {
      const client = new Client();

      let response = await client.distancematrix({
        params: {
          origins: [origin],
          destinations: [destination],
          key: 'redacted',
        },
      });
      return {
        distance: response.data.rows[0].elements[0].distance.text,
        duration: response.data.rows[0].elements[0].duration.text,
      };
    } catch (err) {
      throw new Error(err.response.data.error_message);
    }
  }

  async convertToCoordinates(
    address: string,
  ): Promise<{ placeID: string; lat: number; lng: number }> {
    try {
      const client = new Client();

      let response = await client.geocode({
        params: {
          address,
          key: 'redacted',
          components: {
            country: 'NG',
          },
        },
      });
      return {
        placeID: response.data.results[0].place_id,
        lat: response.data.results[0].geometry.location.lat,
        lng: response.data.results[0].geometry.location.lng,
      };
    } catch (err) {
      throw new Error(err.response.data.error_message);
    }
  }

  async convertToAddress(lat: number, lng: number): Promise<{ place: string }> {
    try {
      const client = new Client();
      let response = await client.reverseGeocode({
        params: {
          latlng: { lat, lng },
          key: 'redacted',
        },
      });
      return {
        place: response.data.results[0].formatted_address,
      };
    } catch (err) {
      throw new Error(err.response.data.error_message);
    }
  }

  async convertToAddressPlace(place_id: string): Promise<{ place: string }> {
    try {
      const client = new Client();
      let response = await client.reverseGeocode({
        params: {
          place_id,
          key: 'redacted',
        },
      });
      return {
        place: response.data.results[0].formatted_address,
      };
    } catch (err) {
      throw new Error(err.response.data.error_message);
    }
  }
}
