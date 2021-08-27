import { gql } from 'graphql-request';
import { api } from 'services/api';
import { Rating } from 'types/rating.type';
import { Bike } from 'types/bike.type';

export interface RateBikeInput extends Pick<Rating, 'rating'> {
  bikeId: Bike['id'];
}
export function rateBike({ rating, bikeId }: RateBikeInput): Promise<{ bikeRating: Rating }> {
  const query = gql`
    mutation RateBike($rating: Number!, $bikeId: String!) {
      bikeRating {
        id
        bikeId
        userId
        rating
      }
    }
  `;

  const variables = { rating, bikeId };
  return api({ query, variables });
}
