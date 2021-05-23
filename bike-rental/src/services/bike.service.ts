import { gql } from 'graphql-request';
import { Bike } from '../types/bike.type';
import { api } from './api';

export function getAllBikes(): Promise<{ bikes: Bike[] }> {
  const query = gql`
    query GetAllBikes {
      bikes {
        id
        model
        color
        location
      }
    }
  `;

  return api({ query });
}

export type CreateBikeInput = Omit<Bike, 'id'>;

export function createBike({ model, color, location }: CreateBikeInput): Promise<{ bike: Bike }> {
  const query = gql`
    mutation CreateBike($model: String!, $color: String!, $location: String!) {
      bike {
        id
        model
        color
        location
      }
    }
  `;

  const variables = { model, color, location };
  return api({ query, variables });
}
