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
        status
      }
    }
  `;

  return api({ query });
}

export type CreateBikeInput = Omit<Bike, 'id'>;

export function createBike({ model, color, location, status }: CreateBikeInput): Promise<{ bike: Bike }> {
  const query = gql`
    mutation CreateBike($model: String!, $color: String!, $location: String!, $status: String!) {
      bike {
        id
        model
        color
        location
        status
      }
    }
  `;

  const variables = { model, color, location, status };
  return api({ query, variables });
}

export function deleteBike(bikeId: Bike['id']): Promise<{ bikeId: Bike['id'] }> {
  const query = gql`
    mutation DeleteBike($bikeId: String!) {
      bikeId
    }
  `;
  const variables = {
    bikeId,
  };
  return api<{ bikeId: Bike['id'] }>({ query, variables });
}

export function editBike(bike: Bike): Promise<{ bike: Bike }> {
  const query = gql`
    type Bike {
      id: String!
      model: String!
      color: String!
      location: String!
      status: String!
    }

    mutation EditBike($bike: Bike) {
      bike {
        id
        model
        color
        location
        status
      }
    }
  `;

  const variables = {
    bike,
  };

  return api<{ bike: Bike }>({ query, variables });
}

export function getBike(bikeId: Bike['id']): Promise<{ bike: Bike }> {
  const query = gql`
    query GetBike($bikeId: String!) {
      bike {
        id
        model
        color
        location
        status
      }
    }
  `;

  const variables = {
    bikeId,
  };

  return api<{ bike: Bike }>({ query, variables });
}
