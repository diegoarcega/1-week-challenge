import { graphql } from 'msw';
import * as Storage from 'utils/storage.util';
import { User } from 'types/user.type';

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

Storage.setItem('users', USERS);

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
    const { user } = req.variables as { user: Pick<User, 'id' | 'email' | 'name'> & { roles: string } };
    const users = Storage.getItem<User[]>('users');
    const newUsers = users.map((_user) => {
      console.log({ _user, user });
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
];
