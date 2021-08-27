import { Bike } from './bike.type';
import { User } from './user.type';

export interface Reservation {
  id: string;
  userId: User['id'];
  bikeId: Bike['id'];
  periodOfTime: {
    from: string;
    to: string;
  };
  status: 'active' | 'cancelled';
}
