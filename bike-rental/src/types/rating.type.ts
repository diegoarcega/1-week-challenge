import { Bike } from './bike.type';
import { User } from './user.type';

export interface Rating {
  id: number;
  user: User['id'];
  bike: Bike['id'];
  rating: number;
}
