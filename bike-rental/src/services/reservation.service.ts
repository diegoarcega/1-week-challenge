import { request, gql } from 'graphql-request';
import { OpenReservation, PaginationAndFiltering, PaginationAndFilteringOutput } from 'mocks/handlers';
import { config } from 'config/config';
import { Bike } from 'types/bike.type';
import { User } from 'types/user.type';
import { Reservation } from 'types/reservation.type';
import { Rating } from 'types/rating.type';
import { api } from './api';

export interface ReservationOutput extends Reservation {
  user: User;
  bike: Bike;
}

export function getAllReservations(): Promise<{ allReservations: ReservationOutput[] }> {
  return request(
    config.baseApiUrl,
    gql`
      query GetAllReservations {
        allReservations {
          id
          user
          bike
          status
          periodOfTime {
            startTime
            endTime
          }
        }
      }
    `
  );
}

type GetOpenReservationsInput = Pick<PaginationAndFiltering, 'perPage' | 'page' | 'filters'> & {
  from: string;
  to: string;
};
export function getOpenReservations({ from, to, perPage, page, filters }: GetOpenReservationsInput): Promise<{
  openReservations: PaginationAndFilteringOutput<OpenReservation>;
}> {
  const query = gql`
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
  `;

  const variables = {
    from,
    to,
    perPage,
    page,
    filters,
  };

  return api({ query, variables });
}

export type ReserveInput = Omit<Reservation, 'id' | 'status' | 'userId'>;
export function reserve({ bikeId, periodOfTime }: ReserveInput): Promise<{ newReservation: Reservation }> {
  const query = gql`
    type PeriodOfTime {
      from: String!
      to: String!
    }

    mutation Reserve($bikeId: String!, $periodOfTime: PeriodOfTime!) {
      reservation {
        id
      }
    }
  `;

  const variables = {
    bikeId,
    periodOfTime,
  };

  return api({ query, variables });
}

export interface UpdateReservation extends Pick<Reservation, 'status'> {
  reservationId: Reservation['id'];
}
export function updateReservation({
  status,
  reservationId,
}: UpdateReservation): Promise<{ updatedReservation: UpdateReservation }> {
  const query = gql`
    mutation UpdateReservation($status: String!, $reservationId: String!) {
      updatedReservation {
        id
        status
      }
    }
  `;

  const variables = {
    status,
    reservationId,
  };

  return api({ query, variables });
}

export interface MyReservation extends Pick<Reservation, 'id' | 'periodOfTime'> {
  bike: Bike;
  rating?: Rating['rating'];
}

export function getMyReservations(): Promise<{ myReservations: MyReservation[] }> {
  const query = gql`
    query GetMyReservations {
      myReservations {
        id
        periodOfTime
        bike
        rating
      }
    }
  `;

  return api({ query });
}
