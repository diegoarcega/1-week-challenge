import { request, gql } from 'graphql-request';
import { config } from '../config/config';
import { Bike } from '../types/bike.type';

export function getAllBikes(): Promise<{ bikes: Bike[] }> {
  return request(
    config.baseApiUrl,
    gql`
      query GetAllBikes {
        bikes {
          id
          model
          color
          location
        }
      }
    `
  );
}
