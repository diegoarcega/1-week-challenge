import { Bike } from 'types/bike.type';
import { v4 as uuid } from 'uuid';
import { getRandom } from './helpers';

export const models = ['fiat', 'bmw', 'volvo', 'mercedes', 'audi', 'jeep'];
export const colors = ['blue', 'yellow', 'pink', 'white', 'black'];
export const locations = [
  '55 Marino St, San Diego, CA, USA',
  '1 Catch St, New York, NY, USA',
  '34 Kennedy St, Miami, CA, USA',
];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createRandomBikes(amount: number) {
  const bikes = [];
  for (let i = 0; i <= amount; i += 1) {
    bikes.push({
      id: uuid(),
      model: getRandom(models) as Bike['model'],
      color: getRandom(colors) as Bike['color'],
      location: getRandom(locations) as Bike['location'],
      status: 'available' as string,
    });
  }

  return bikes;
}
