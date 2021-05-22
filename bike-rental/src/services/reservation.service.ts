import { request, gql } from 'graphql-request';
import { OpenReservation, PaginationAndFiltering, PaginationAndFilteringOutput } from 'mocks/handlers';
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

export function getOpenReservations({
  perPage,
  page,
  filters,
}: Pick<PaginationAndFiltering, 'perPage' | 'page' | 'filters'>): Promise<{
  openReservations: PaginationAndFilteringOutput<OpenReservation>;
}> {
  return request(
    config.baseApiUrl,
    gql`
      query OpenReservations {
        openReservations {
          bike {
            id
            model
            color
            location
          }
          ratingAverage
          availablePeriods {
            from
            to
          }
        }
      }
    `,
    {
      perPage,
      page,
      filters,
    }
  );
}
