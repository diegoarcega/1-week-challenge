import { Bike } from './bike.type';
import { User } from './user.type';

export interface Rating {
  id: string;
  userId: User['id'];
  bikeId: Bike['id'];
  rating: number;
}
