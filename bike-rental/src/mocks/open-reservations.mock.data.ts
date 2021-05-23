import { v4 as uuid } from 'uuid';
import { getRandom } from './helpers';

const models = ['fiat', 'bmw', 'volvo', 'mercedes', 'audi', 'jeep'];
const colors = ['blue', 'yellow', 'pink', 'white', 'black'];
const locations = [
  '55 Marino St, San Diego, CA, USA',
  '1 Catch St, New York, NY, USA',
  '34 Kennedy St, Miami, CA, USA',
];
const ratingAverages = [5, 4, 3, 2, 1];
const availablePeriods = [
  {
    from: '2021-06-21',
    to: '2021-06-22',
  },
  {
    from: '2021-06-20',
    to: '2021-06-20',
  },
  {
    from: '2021-07-01',
    to: '',
  },
];

function createOpenReservations(amount: number) {
  const openReservations = [];

  for (let i = 0; i <= amount; i += 1) {
    openReservations.push({
      bike: {
        id: uuid(),
        model: getRandom(models),
        color: getRandom(colors),
        location: getRandom(locations),
      },
      ratingAverage: getRandom(ratingAverages),
      availablePeriods: getRandom(availablePeriods),
    });
  }
  return openReservations;
}

export const OPEN_RESERVATIONS = [
  {
    bike: {
      id: '1',
      model: 'fiat',
      color: 'blue',
      location: 'san diego, sf, usa',
    },
    ratingAverage: 2,
    availablePeriods: [
      {
        from: '2021-05-21',
        to: '2021-05-22',
      },
      {
        from: '2021-05-22',
        to: '',
      },
    ],
  },
  {
    bike: {
      id: '2',
      model: 'bmw',
      color: 'red',
      location: 'san rafael, sf, usa',
    },
    ratingAverage: 5,
    availablePeriods: [
      {
        from: '2021-05-21',
        to: '2021-05-22',
      },
      {
        from: '2021-05-22',
        to: '',
      },
    ],
  },
  {
    bike: {
      id: '3',
      model: 'honda',
      color: 'red',
      location: 'san rafael, sf, usa',
    },
    ratingAverage: 5,
    availablePeriods: [
      {
        from: '2021-05-21',
        to: '2021-05-22',
      },
      {
        from: '2021-05-22',
        to: '',
      },
    ],
  },
  ...createOpenReservations(50),
];
