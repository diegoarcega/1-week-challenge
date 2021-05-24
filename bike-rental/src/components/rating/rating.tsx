import React from 'react';
import ReactStars from 'react-rating-stars-component';
import { FaStarHalfAlt, FaStar, FaRegStar } from 'react-icons/fa';

interface RatingProps {
  onChange?: (rating: number) => void;
  value?: number;
  edit?: boolean;
  isHalf?: boolean;
}
export const Rating = (props: RatingProps): JSX.Element => {
  return (
    <ReactStars
      {...props}
      size={30}
      emptyIcon={<FaRegStar />}
      halfIcon={<FaStarHalfAlt />}
      fullIcon={<FaStar />}
      activeColor="#ffd700"
      color="#ccc"
    />
  );
};
