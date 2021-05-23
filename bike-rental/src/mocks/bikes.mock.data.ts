import { v4 as uuid } from 'uuid';
import { getRandom } from './helpers';

export const models = ['fiat', 'bmw', 'volvo', 'mercedes', 'audi', 'jeep'];
export const colors = ['blue', 'yellow', 'pink', 'white', 'black'];
export const locations = [
  '55 Marino St, San Diego, CA, USA',
  '1 Catch St, New York, NY, USA',
  '34 Kennedy St, Miami, CA, USA',
];

export function createRandomBikes(amount: number) {
  const bikes = [];
  for (let i = 0; i <= amount; i += 1) {
    bikes.push({
      id: uuid(),
      model: getRandom(models),
      color: getRandom(colors),
      location: getRandom(locations),
    });
  }

  return bikes;
}
