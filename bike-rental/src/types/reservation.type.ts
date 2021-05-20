import { Bike } from './bike.type';
import { User } from './user.type';

export interface Reservation {
  id: number;
  user: User['id'];
  bike: Bike['id'];
  periodOfTime: {
    startTime: string;
    endTime: string;
  };
  status: 'active' | 'cancelled';
}
