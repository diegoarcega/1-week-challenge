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
