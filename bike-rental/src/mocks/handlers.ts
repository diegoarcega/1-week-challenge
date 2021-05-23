import { graphql, GraphQLRequest, GraphQLVariables } from 'msw';
import get from 'lodash/get';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import * as Storage from 'utils/storage.util';
import { User } from 'types/user.type';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';
import { Reservation } from 'types/reservation.type';

import { availablePeriods, ratingAverages } from './open-reservations.mock.data';
import { ALL_RESERVATIONS } from './all-reservations.mock.data';

import { createRandomBikes } from './bikes.mock.data';
import { getRandom } from './helpers';

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
    roles: [],
  },
];

const JWT_SECRET = 'Shhh';

const AUTH_TOKENS_DATABASE_KEY = 'auth-tokens'; // used to check if they exist (dont need it anymore bc of JWT)
const USERS_DATABASE_KEY = 'users'; // id, name, email, password, roles
const BIKES_DATABASE_KEY = 'bikes'; // id, mode, color, location
const RATINGS_DATABASE_KEY = 'ratings'; // id, userId, bikeId, rating
const ALL_RESERVATIONS_DATABASE_KEY = 'all-reservations'; // id, userId, bikeId, periodOfTime // created by the user
const OPEN_RESERVATIONS_COMBINATION = 'open-reservations'; // bikeId, rating, periodOfTime - fetch all BIKES_DATABASE_KEY
// combine with RATINGS_DATABASE_KEY getting its avg, combine it with ALL_RESERVATIONS_DATABASE_KEY ang get the dates the bikes are busy
const MY_RESERVATIONS_COMBINATION = 'my-reservations'; // fetch all ALL_RESERVATIONS_DATABASE_KEY with a userId
// and combine it with BIKES_DATABASE_KEY and RATINGS_DATABASE_KEY; returns { bike model, periodOfTime, rating }

Storage.setItem(USERS_DATABASE_KEY, USERS);

Storage.setItem(RATINGS_DATABASE_KEY, []);
Storage.setItem(ALL_RESERVATIONS_DATABASE_KEY, ALL_RESERVATIONS);

// Storage.setItem(MY_RESERVATIONS_COMBINATION, MY_RESERVATIONS);

Storage.setItem(AUTH_TOKENS_DATABASE_KEY, []);

// will start without reservations
function initApp() {
  const randomBikes = createRandomBikes(50);
  const openReservations = randomBikes.map((bike) => {
    return {
      bike,
      ratingAverage: getRandom(ratingAverages),
      availablePeriods: getRandom(availablePeriods),
    };
  });

  // TODO: combine openReservations with RATINGS and ALL RESERVATIONS
  Storage.setItem(OPEN_RESERVATIONS_COMBINATION, openReservations);
  Storage.setItem(BIKES_DATABASE_KEY, randomBikes);
}

initApp();

function createJwtToken(user: User): string {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return jwt.sign(
    {
      data: user,
    },
    JWT_SECRET,
    { expiresIn: '30min' }
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

interface AuthTokensDatabase {
  [key: string]: User;
}

export interface OpenReservation {
  bike: Bike;
  ratingAverage: Rating['rating'];
  availablePeriods: { from: string; to: string }[];
}

interface MyReservation {
  id: string;
  bike: Bike;
  periodOfTime: { from: string; to: string };
}

const MY_RESERVATIONS = [
  {
    id: '1',
    bike: {
      id: '2',
      model: '54-p4',
      color: 'yellow',
      location: 'san raphael, sf, usa',
    },
    periodOfTime: {
      from: '2021-05-21',
      to: '2021-05-23',
    },
  },
];

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
    const authTokens: AuthTokensDatabase[] = Storage.getItem(AUTH_TOKENS_DATABASE_KEY);
    Storage.setItem(
      AUTH_TOKENS_DATABASE_KEY,
      authTokens.concat({
        [authToken]: foundUser,
      })
    );

    // TODO: send only the token and decode it in FE
    return res(
      ctx.data({
        token: authToken,
        user: foundUser,
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
    const { model, color, location } = req.variables as Pick<Bike, 'model' | 'color' | 'location'>;

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
    const { perPage, page, filters } = req.variables;

    const openReservations = Storage.getItem<Record<string, string>[]>(OPEN_RESERVATIONS_COMBINATION);
    return res(
      ctx.data({
        openReservations: withPaginationAndFiltering({
          perPage,
          page,
          filters,
          results: openReservations,
        }),
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
    const allBikes = Storage.getItem<Bike[]>(BIKES_DATABASE_KEY);

    const myReservations = allReservations.filter((reservation) => {
      return reservation.userId === user.id && reservation.status === 'active';
    });

    const myReservationsWithBike = myReservations.map((reservation) => {
      return {
        ...reservation,
        bike: allBikes.find((bike) => bike.id === reservation.bikeId),
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
  graphql.mutation('Reserve', (req, res, ctx) => {
    const { userId, bikeId, periodOfTime } = req.variables;
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

    const newReservation: Reservation = {
      id: uuid(),
      userId,
      bikeId,
      periodOfTime,
      status: 'active',
    };

    const allReservations = Storage.getItem<Reservation[]>(ALL_RESERVATIONS_DATABASE_KEY);
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
  filters: { [key: string]: string };
  perPage: number;
  page: number;
  results: Record<string, string>[];
}

export interface PaginationAndFilteringOutput<T> extends Omit<PaginationAndFiltering, 'filters' | 'results'> {
  totalPages: number;
  totalResults: number;
  results: T[];
}

function withPaginationAndFiltering({ filters, perPage, page, results }: PaginationAndFiltering) {
  const totalResultsLength = results.length;
  const totalPages = Math.ceil(totalResultsLength / perPage);
  const pageIndex = page === 1 ? page - 1 : page;
  const endIndex = page === 1 ? perPage : pageIndex + perPage;
  const paginatedResults = results.slice(pageIndex, endIndex);
  const filteredResults = withFilters({ filters, results: paginatedResults });

  return {
    perPage,
    page,
    results: filteredResults,
    totalPages,
    totalResults: totalResultsLength,
  };
}

function withFilters({ filters, results }: Pick<PaginationAndFiltering, 'filters' | 'results'>) {
  const filteredResults = results.filter((result) => {
    if (!Object.keys(filters).length) {
      return true;
    }

    return Object.entries(filters).some(([filterKey, filterValue]) => {
      return get(result, filterKey).includes(filterValue);
    });
  });

  return filteredResults;
}
