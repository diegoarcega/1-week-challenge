import { graphql, GraphQLRequest, GraphQLVariables } from 'msw';
import dayjs from 'utils/date.util';
import get from 'lodash/get';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import * as Storage from 'utils/storage.util';
import { User } from 'types/user.type';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';
import { Reservation } from 'types/reservation.type';

import { ALL_RESERVATIONS } from './all-reservations.mock.data';
import { createRandomBikes } from './bikes.mock.data';

type OpenReservationsWithPaginator = Record<string, string | number | { [key: string]: string } | undefined>;
const USERS = [
  {
    id: '1',
    name: 'Diego Manager',
    email: 'diego.manager@gmail.com',
    password: '11111111',
    roles: ['manager'],
  },
  {
    id: '2',
    name: 'Diego Normal',
    email: 'diego.normal@gmail.com',
    password: '11111111',
    roles: ['user'],
  },
];

const AUTH_TOKENS_DATABASE_KEY = 'auth-tokens'; // used to check if they exist (dont need it anymore bc of JWT)
const USERS_DATABASE_KEY = 'users'; // id, name, email, password, roles
const BIKES_DATABASE_KEY = 'bikes'; // id, mode, color, location
const RATINGS_DATABASE_KEY = 'ratings'; // id, userId, bikeId, rating
const ALL_RESERVATIONS_DATABASE_KEY = 'all-reservations'; // id, userId, bikeId, periodOfTime // created by the user
// const OPEN_RESERVATIONS_COMBINATION = 'open-reservations'; // bikeId, rating, periodOfTime - fetch all BIKES_DATABASE_KEY
// combine with RATINGS_DATABASE_KEY getting its avg, combine it with ALL_RESERVATIONS_DATABASE_KEY ang get the dates the bikes are busy
// const MY_RESERVATIONS_COMBINATION = 'my-reservations'; // fetch all ALL_RESERVATIONS_DATABASE_KEY with a userId
// and combine it with BIKES_DATABASE_KEY and RATINGS_DATABASE_KEY; returns { bike model, periodOfTime, rating }

Storage.setItem(USERS_DATABASE_KEY, USERS);

Storage.setItem(RATINGS_DATABASE_KEY, []);
Storage.setItem(ALL_RESERVATIONS_DATABASE_KEY, ALL_RESERVATIONS);

Storage.setItem(AUTH_TOKENS_DATABASE_KEY, []);

// will start without reservations
function initApp() {
  const randomBikes = createRandomBikes(3);
  const diegoNormal = USERS[1];
  // rate some bikes
  const ratings = [
    {
      id: uuid(),
      userId: diegoNormal.id,
      bikeId: randomBikes[0].id,
      rating: 4,
    },
    {
      id: uuid(),
      userId: USERS[0].id,
      bikeId: randomBikes[0].id,
      rating: 1,
    },
    {
      id: uuid(),
      userId: diegoNormal.id,
      bikeId: randomBikes[1].id,
      rating: 5,
    },
  ];

  Storage.setItem(BIKES_DATABASE_KEY, randomBikes);
  Storage.setItem(RATINGS_DATABASE_KEY, ratings);
}

initApp();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function initOpenReservations(bikes: any[], ratings: Rating[]) {
  return bikes.map((bike) => {
    const bikeRatings = ratings.filter((rate) => rate.bikeId === bike.id);
    const ratingSum = bikeRatings.reduce((acc, item) => acc + item.rating, 0);
    return {
      bike,
      ratingAverage: bikeRatings.length === 0 ? undefined : ratingSum / bikeRatings.length,
    };
  });
}

const JWT_SECRET = 'Shhhhhhhhh';
function createJwtToken(user: User): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return jwt.sign(
    {
      data: user,
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}

function hasAuthTokenExpired(req: GraphQLRequest<GraphQLVariables>) {
  const token = req.headers.get('authorization');
  if (token) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    jwt.verify(token, JWT_SECRET);
  }
}

function getUserFromToken(req: GraphQLRequest<GraphQLVariables>) {
  const token = req.headers.get('authorization');

  if (token) {
    const decodedToken = jwt.decode(token) as { data: User };
    return decodedToken.data;
  }

  throw new Error('User is not authenticated');
}

interface UserDatabase extends User {
  password: string;
}

export interface OpenReservation {
  bike: Bike;
  ratingAverage: Rating['rating'];
  periodsOfTime: { from: string; to: string }[];
}

export const handlers = [
  graphql.query('GetUsers', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const users = Storage.getItem<User[]>(USERS_DATABASE_KEY);

    return res(
      ctx.data({
        users,
      })
    );
  }),
  graphql.query('GetUser', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { userId } = req.variables;
    const users = Storage.getItem<User[]>(USERS_DATABASE_KEY);

    return res(
      ctx.data({
        user: users.find((user) => user.id === userId),
      })
    );
  }),
  graphql.mutation('DeleteUser', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { userId } = req.variables;
    const users = Storage.getItem<User[]>(USERS_DATABASE_KEY);

    const newUsers = users.filter((user) => user.id !== userId);

    Storage.setItem(USERS_DATABASE_KEY, newUsers);

    return res(
      ctx.data({
        users: newUsers,
      })
    );
  }),
  graphql.mutation('CreateUser', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { name, email, password, roles } = req.variables as Pick<User, 'name' | 'email'> & {
      password: string;
      roles?: string;
    };
    const users = Storage.getItem<UserDatabase[]>(USERS_DATABASE_KEY);
    const userAlreadyExists = users.find((u) => u.email === email);

    if (userAlreadyExists) {
      return res(
        ctx.errors([
          {
            message: 'User already exists',
          },
        ])
      );
    }

    const newUser = {
      roles: roles ? roles.replace(' ', '').split(',') : [],
      name,
      email,
      id: uuid(),
    };

    Storage.setItem(USERS_DATABASE_KEY, users.concat({ ...newUser, password }));

    return res(
      ctx.data({
        user: newUser,
      })
    );
  }),
  graphql.mutation('CreateAccount', (req, res, ctx) => {
    const { name, email, password } = req.variables as Pick<User, 'name' | 'email'> & {
      password: string;
    };
    const users = Storage.getItem<UserDatabase[]>(USERS_DATABASE_KEY);
    const userAlreadyExists = users.find((u) => u.email === email);

    if (userAlreadyExists) {
      return res(
        ctx.errors([
          {
            message: 'User already exists',
          },
        ])
      );
    }

    const newUser = {
      roles: ['user'],
      name,
      email,
      id: uuid(),
    };

    Storage.setItem(USERS_DATABASE_KEY, users.concat({ ...newUser, password }));

    const authToken = createJwtToken(newUser);

    return res(
      ctx.data({
        token: authToken,
      })
    );
  }),
  graphql.mutation('EditUser', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { user } = req.variables as {
      user: Pick<User, 'id' | 'email' | 'name'> & { roles: string };
    };
    const users = Storage.getItem<User[]>(USERS_DATABASE_KEY);
    const newUsers = users.map((_user) => {
      if (_user.id === user.id) {
        return {
          ..._user,
          ...user,
          roles: user.roles.replace(' ', '').split(','),
        };
      }
      return _user;
    });

    Storage.setItem(USERS_DATABASE_KEY, newUsers);
    return res(
      ctx.data({
        user,
      })
    );
  }),
  graphql.mutation('LoginUser', (req, res, ctx) => {
    const { email, password } = req.variables as Pick<User, 'email'> & { password: string };
    const users = Storage.getItem<UserDatabase[]>(USERS_DATABASE_KEY);
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      return res(
        ctx.errors([
          {
            message: 'Invalid email or password',
          },
        ])
      );
    }

    const authToken = createJwtToken(foundUser);

    return res(
      ctx.data({
        token: authToken,
      })
    );
  }),
  graphql.query('GetAllBikes', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }

    const allBikes = Storage.getItem(BIKES_DATABASE_KEY);
    return res(
      ctx.data({
        bikes: allBikes,
      })
    );
  }),
  graphql.mutation('CreateBike', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { model, color, location, status } = req.variables as Omit<Bike, 'id'>;

    const allBikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);
    const bikeAlreadyExists = allBikes.find(
      (bike) => bike.model === model && bike.color === color && bike.location === location
    );

    if (bikeAlreadyExists) {
      return res(
        ctx.errors([
          {
            message: 'Bike already exists',
          },
        ])
      );
    }

    const newBike = {
      status,
      model,
      color,
      location,
      id: uuid(),
    };

    Storage.setItem(BIKES_DATABASE_KEY, allBikes.concat(newBike));

    return res(
      ctx.data({
        bike: newBike,
      })
    );
  }),
  graphql.mutation('EditBike', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { bike } = req.variables as {
      bike: Bike;
    };

    const allBikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);
    const newBikes = allBikes.map((_bike) => {
      if (_bike.id === bike.id) {
        return {
          ..._bike,
          ...bike,
        };
      }
      return _bike;
    });

    Storage.setItem(BIKES_DATABASE_KEY, newBikes);
    return res(
      ctx.data({
        bike,
      })
    );
  }),
  graphql.query('GetBike', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { bikeId } = req.variables;
    const bikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);

    return res(
      ctx.data({
        bike: bikes.find((bike) => bike.id === bikeId),
      })
    );
  }),
  graphql.mutation('DeleteBike', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { bikeId } = req.variables;
    const bikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);

    const newBikes = bikes.filter((bike) => bike.id !== bikeId);

    Storage.setItem(BIKES_DATABASE_KEY, newBikes);

    return res(
      ctx.data({
        bikes: newBikes,
      })
    );
  }),
  graphql.query('GetAllReservations', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }

    const allReservations = Storage.getItem<Reservation[]>(ALL_RESERVATIONS_DATABASE_KEY);
    const allBikes = Storage.getItem<Reservation[]>(BIKES_DATABASE_KEY);
    const allUsers = Storage.getItem<Reservation[]>(USERS_DATABASE_KEY);

    return res(
      ctx.data({
        allReservations: allReservations.map((reservation) => {
          return {
            id: reservation.id,
            bike: allBikes.find((bike) => bike.id === reservation.bikeId),
            user: allUsers.find((user) => user.id === reservation.userId),
            periodOfTime: reservation.periodOfTime,
            status: reservation.status,
          };
        }),
      })
    );
  }),
  graphql.query('OpenReservations', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const { perPage, page, filters, from, to } = req.variables;

    // database
    const allBikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);
    const allRatings = Storage.getItem<Rating[]>(RATINGS_DATABASE_KEY);
    const openReservationsWithRating = initOpenReservations(allBikes, allRatings);

    let openReservationsByDate = openReservationsWithRating;
    // filter by date
    // add periodoftime
    // if from to, fetch all reservations and combine, then filter
    if (from !== '' && to !== '') {
      const allReservations = Storage.getItem<Reservation[]>(ALL_RESERVATIONS_DATABASE_KEY);
      openReservationsByDate = openReservationsWithRating.map((openReservation) => {
        const reservationOfBike = allReservations.filter((reservation) => {
          return reservation.bikeId === openReservation.bike.id;
        });
        return {
          ...openReservation,
          periodsOfTime: reservationOfBike.map((reservation) => reservation.periodOfTime),
        };
      });

      openReservationsByDate = byDate({
        from,
        to,
        results: openReservationsByDate as OpenReservation[],
      });
    }

    const openReservationsFinal = withPaginationAndFiltering({
      perPage,
      page,
      filters,
      results: openReservationsByDate as unknown as OpenReservationsWithPaginator[],
    });

    return res(
      ctx.data({
        models: openReservationsWithRating.reduce<{ [key: string]: number }>((acc, item: { bike: Bike }) => {
          acc[item.bike.model] = (acc[item.bike.model] || 0) + 1;
          return acc;
        }, {}),
        colors: openReservationsWithRating.reduce<{ [key: string]: number }>((acc, item: { bike: Bike }) => {
          acc[item.bike.color] = (acc[item.bike.color] || 0) + 1;
          return acc;
        }, {}),
        openReservations: openReservationsFinal,
      })
    );
  }),
  graphql.query('GetMyReservations', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }
    const user = getUserFromToken(req);

    const allReservations = Storage.getItem<Reservation[]>(ALL_RESERVATIONS_DATABASE_KEY);
    const allRatings = Storage.getItem<Rating[]>(RATINGS_DATABASE_KEY);
    const allBikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);

    const myReservations = allReservations.filter((reservation) => {
      return reservation.userId === user.id && reservation.status === 'active';
    });

    const myReservationsWithBike = myReservations.map((reservation) => {
      return {
        ...reservation,
        bike: allBikes.find((bike) => bike.id === reservation.bikeId),
        rating: allRatings.find((rating) => rating.userId === user.id && rating.bikeId === reservation.bikeId)?.rating,
      };
    });

    return res(
      ctx.data({
        myReservations: myReservationsWithBike,
      })
    );
  }),
  graphql.mutation('UpdateReservation', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }

    const { reservationId, status } = req.variables;
    const allReservations = Storage.getItem<Reservation[]>(ALL_RESERVATIONS_DATABASE_KEY);

    const myReservationIndex = allReservations.findIndex((reservation) => reservation.id === reservationId);
    if (myReservationIndex !== -1) {
      const myReservation = allReservations[myReservationIndex];

      // update my reservation
      const myUpdatedReservation: Reservation = {
        ...myReservation,
        status,
        // TODO: add rating
      };

      // update database with all reservations
      allReservations[myReservationIndex] = myUpdatedReservation;
      Storage.setItem(ALL_RESERVATIONS_DATABASE_KEY, allReservations);

      // only with status active
      return res(
        ctx.data({
          updatedReservation: myUpdatedReservation,
        })
      );
    }

    return res(
      ctx.errors([
        {
          message: 'Reservation not found',
        },
      ])
    );
  }),
  graphql.mutation('RateBike', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }

    const user = getUserFromToken(req);
    const { bikeId, rating } = req.variables as { bikeId: Bike['id']; rating: Rating['rating'] };

    const newRating = {
      id: uuid(),
      bikeId,
      rating,
      userId: user.id,
    };

    const allRatings = Storage.getItem<Rating[]>(RATINGS_DATABASE_KEY);
    allRatings.push(newRating);
    Storage.setItem(RATINGS_DATABASE_KEY, allRatings);

    return res(
      ctx.data({
        bikeRating: newRating,
      })
    );
  }),
  graphql.mutation('Reserve', (req, res, ctx) => {
    try {
      hasAuthTokenExpired(req);
    } catch {
      return res(
        ctx.errors([
          {
            message: 'Session has expired',
          },
        ])
      );
    }

    const { bikeId, periodOfTime } = req.variables;
    const user = getUserFromToken(req);

    const newReservation: Reservation = {
      id: uuid(),
      userId: user.id,
      bikeId,
      periodOfTime,
      status: 'active',
    };

    const allReservations = Storage.getItem<Reservation[]>(ALL_RESERVATIONS_DATABASE_KEY);
    const isTaken = allReservations
      .filter((reservation) => reservation.status === 'active')
      .some((reservation) => {
        if (reservation.bikeId === bikeId) {
          const { from, to } = periodOfTime;
          const { periodOfTime: periodOfTimeOfReservation } = reservation;

          let isFromReserved = false;
          let isToReserved = false;
          let isBetweenFrom = false;
          let isBetweenTo = false;

          if (from === to) {
            isFromReserved = dayjs(from).isBetween(
              periodOfTimeOfReservation.from,
              periodOfTimeOfReservation.to,
              null,
              '[]'
            );
            isToReserved = dayjs(to).isBetween(
              periodOfTimeOfReservation.from,
              periodOfTimeOfReservation.to,
              null,
              '[]'
            );
          } else {
            isBetweenFrom = dayjs(periodOfTimeOfReservation.from).isBetween(from, to, null, '[]');
            isBetweenTo = dayjs(periodOfTimeOfReservation.to).isBetween(from, to, null, '[]');

            isFromReserved = dayjs(from).isBetween(
              periodOfTimeOfReservation.from,
              periodOfTimeOfReservation.to,
              null,
              '[]'
            );
            isToReserved = dayjs(to).isBetween(
              periodOfTimeOfReservation.from,
              periodOfTimeOfReservation.to,
              null,
              '[]'
            );
          }

          // bike is already reserved within the time range
          if (isBetweenFrom || isBetweenTo || isFromReserved || isToReserved) {
            return true;
          }
        }
        return false;
      });

    if (isTaken) {
      return res(
        ctx.errors([
          {
            message: 'This bike is already taken for that period of time',
          },
        ])
      );
    }

    allReservations.push(newReservation);
    Storage.setItem(ALL_RESERVATIONS_DATABASE_KEY, allReservations);

    return res(
      ctx.data({
        newReservation,
      })
    );
  }),
];

export interface PaginationAndFiltering {
  filters: { [key: string]: string | number | string[] };
  perPage: number;
  page: number;
  results: OpenReservationsWithPaginator[];
}

export interface PaginationAndFilteringOutput<T> extends Omit<PaginationAndFiltering, 'filters' | 'results'> {
  totalPages: number;
  totalResults: number;
  results: T[];
}

function withPaginationAndFiltering({ filters, perPage, page, results }: PaginationAndFiltering) {
  const sliceStart = page === 1 ? 0 : (page - 1) * perPage;
  const sliceEnd = page === 1 ? perPage : page * perPage;
  const filteredResults = withFilters({ filters, results });
  const paginatedResults = filteredResults.slice(sliceStart, sliceEnd);
  const totalPagesFinal = filteredResults.length === 0 ? 1 : Math.ceil(filteredResults.length / perPage);

  return {
    perPage,
    page,
    results: paginatedResults,
    totalPages: totalPagesFinal,
    totalResults: filteredResults.length,
  };
}

function withFilters({ filters, results }: Pick<PaginationAndFiltering, 'filters' | 'results'>) {
  const filteredResults = results.filter((result) => {
    if (!Object.keys(filters).length) {
      return true;
    }

    return Object.entries(filters).some(([filterKey, filterValue]) => {
      const resultValue = get(result, filterKey) as string | number;

      if (!filterValue) {
        return true;
      }

      // models, colors
      if (Array.isArray(filterValue)) {
        return filterValue.includes(resultValue as string);
      }

      // rating
      if (typeof resultValue === 'number') {
        return Math.floor(resultValue) === filterValue;
      }

      // location
      if (typeof resultValue === 'string') {
        return resultValue.toLowerCase().includes((filterValue as string).toLowerCase());
      }

      return false;
    });
  });

  return filteredResults;
}

interface DateFilter {
  from: string;
  to: string;
  results: OpenReservation[];
}
function byDate({ from, to, results }: DateFilter) {
  return results.filter((result) => {
    return !result.periodsOfTime.some((periodOfTime) => {
      let isFromReserved = false;
      let isToReserved = false;
      let isBetweenFrom = false;
      let isBetweenTo = false;

      if (from === to) {
        isFromReserved = dayjs(from).isBetween(periodOfTime.from, periodOfTime.to, null, '[]');
        isToReserved = dayjs(to).isBetween(periodOfTime.from, periodOfTime.to, null, '[]');
      } else {
        isBetweenFrom = dayjs(periodOfTime.from).isBetween(from, to, null, '[]');
        isBetweenTo = dayjs(periodOfTime.to).isBetween(from, to, null, '[]');

        isFromReserved = dayjs(from).isBetween(periodOfTime.from, periodOfTime.to, null, '[]');
        isToReserved = dayjs(to).isBetween(periodOfTime.from, periodOfTime.to, null, '[]');
      }

      // bike is already reserved within the time range
      if (isBetweenFrom || isBetweenTo || isFromReserved || isToReserved) {
        return true;
      }

      return false;
    });
  });
}
