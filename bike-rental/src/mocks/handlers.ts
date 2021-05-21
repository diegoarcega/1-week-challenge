import { graphql } from 'msw';

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

export const handlers = [
  graphql.query('GetUsers', (req, res, ctx) => {
    return res(
      ctx.data({
        users: USERS,
      })
    );
  }),
  graphql.query('GetUser', (req, res, ctx) => {
    console.log(req.variables);
    const { userId } = req.variables;

    return res(
      ctx.data({
        user: USERS.find((user) => user.id === userId),
      })
    );
  }),
];
