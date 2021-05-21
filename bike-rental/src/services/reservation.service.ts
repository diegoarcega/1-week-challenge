import { request, gql } from 'graphql-request';
import { config } from '../config/config';
import { Bike } from '../types/bike.type';
import { User } from '../types/user.type';

export interface Reservation {
  id: number;
  user: User['name'];
  bike: Bike['model'];
  periodOfTime: {
    startTime: string;
    endTime: string;
  };
}

export function getAllReservations(): Promise<{ reservations: Reservation[] }> {
  return request(
    config.baseApiUrl,
    gql`
      query GetAllReservations {
        reservations {
          id
          user
          bike
          periodOfTime {
            startTime
            endTime
          }
        }
      }
    `
  );
}
