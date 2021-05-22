import { graphql } from 'msw';
import * as Storage from 'utils/storage.util';
import { User } from 'types/user.type';
import { Bike } from 'types/bike.type';
import { Rating } from 'types/rating.type';

const USERS = [
  {
    id: '1',
    name: 'Diego Manager',
    email: 'diego.manager@gmail.com',
    password: '12345678',
    roles: ['manager'],
  },
  {
    id: '2',
    name: 'Diego Normal',
    email: 'diego.normal@gmail.com',
    password: '87654321',
    roles: [],
  },
];

const RESERVATIONS = [
  {
    id: '1',
    user: 'Diego',
    bike: '55-4',
    periodOfTime: {
      startTime: '2021-05-20',
      endTime: '2021-05-21',
    },
  },
  {
    id: '2',
    user: 'Carina',
    bike: '55gg-4',
    periodOfTime: {
      startTime: '2021-05-21',
      endTime: '2021-05-22',
    },
  },
];

const BIKES = [
  {
    id: '1',
    model: '55-p4',
    color: 'blue',
    location: 'san diego, sf, usa',
  },
  {
    id: '2',
    model: '54-p4',
    color: 'yellow',
    location: 'san raphael, sf, usa',
  },
];

export interface OpenReservation {
  bike: Bike;
  ratingAverage: Rating['rating'];
  availablePeriods: { from: string; to: string }[];
}

const OPEN_RESERVATIONS = [
  {
    bike: {
      id: '1',
      model: '55-p4',
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
      model: 'vv-p4',
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
];

interface MyReservation {
  id: string;
  bike: Bike;
  periodOfTime: { from: string; to: string }[];
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

Storage.setItem('users', USERS);
Storage.setItem('openReservations', OPEN_RESERVATIONS);
Storage.setItem('myReservations', MY_RESERVATIONS);

export const handlers = [
  graphql.query('GetUsers', (req, res, ctx) => {
    const users = Storage.getItem<User[]>('users');

    return res(
      ctx.data({
        users,
      })
    );
  }),
  graphql.query('GetUser', (req, res, ctx) => {
    const { userId } = req.variables;
    const users = Storage.getItem<User[]>('users');

    return res(
      ctx.data({
        user: users.find((user) => user.id === userId),
      })
    );
  }),
  graphql.mutation('DeleteUser', (req, res, ctx) => {
    const { userId } = req.variables;
    const users = Storage.getItem<User[]>('users');
    const newUsers = users.filter((user) => user.id !== userId);
    Storage.setItem('users', newUsers);

    return res(
      ctx.data({
        users: newUsers,
      })
    );
  }),
  graphql.mutation('EditUser', (req, res, ctx) => {
    const { user } = req.variables as {
      user: Pick<User, 'id' | 'email' | 'name'> & { roles: string };
    };
    const users = Storage.getItem<User[]>('users');
    const newUsers = users.map((_user) => {
      if (_user.id === user.id) {
        return {
          ...user,
          roles: user.roles.replace(' ', '').split(','),
        };
      }
      return _user;
    });

    Storage.setItem('users', newUsers);
    return res(
      ctx.data({
        user,
      })
    );
  }),
  graphql.query('GetAllBikes', (req, res, ctx) => {
    return res(
      ctx.data({
        bikes: BIKES,
      })
    );
  }),
  graphql.query('GetAllReservations', (req, res, ctx) => {
    return res(
      ctx.data({
        reservations: RESERVATIONS,
      })
    );
  }),
  graphql.query('OpenReservations', (req, res, ctx) => {
    const { perPage, page, filters = {} } = req.variables;
    const openReservations = Storage.getItem<Record<string, string>[]>('openReservations');
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
  graphql.query('MyReservations', (req, res, ctx) => {
    const myReservations = Storage.getItem<MyReservation[]>('myReservations');
    return res(
      ctx.data({
        myReservations,
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
  const totalPages = totalResultsLength / perPage;
  const paginatedResults = results.slice(page - 1, perPage);
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

    return Object.entries(filters).some(([filterKey, filterValue]) => result[filterKey] === filterValue);
  });

  return filteredResults;
}
