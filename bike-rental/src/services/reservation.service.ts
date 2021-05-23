import { request, gql } from 'graphql-request';
import { OpenReservation, PaginationAndFiltering, PaginationAndFilteringOutput } from 'mocks/handlers';
import { config } from 'config/config';
import { Bike } from 'types/bike.type';
import { User } from 'types/user.type';
import { Reservation as ReservationData } from 'types/reservation.type';
import { api } from './api';

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

export type ReserveInput = Omit<ReservationData, 'id' | 'status'>;
export function reserve({ userId, bikeId, periodOfTime }: ReserveInput): Promise<{ newReservation: ReservationData }> {
  const query = gql`
    type PeriodOfTime {
      from: String!
      to: String!
    }

    mutation Reserve($userId: String!, $bikeId: String!, $periodOfTime: PeriodOfTime!) {
      user {
        id
        name
        email
        roles
      }
    }
  `;
  const variables = {
    userId,
    bikeId,
    periodOfTime,
  };

  return api({ query, variables });
}

export function getMyReservations({ userId }: { userId: User['id'] }): Promise<{ myReservations: ReservationData }> {
  const query = gql`
    query MyReservations($userId: String!) {
      myReservations {
        id
        name
        email
        roles
      }
    }
  `;
  const variables = {
    userId,
  };

  return api({ query, variables });
}
