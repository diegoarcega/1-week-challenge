import { graphql, rest } from 'msw';

export const handlers = [
  rest.get('/login10', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
        firstName: 'John',
        lastName: 'Maverick',
      })
    );
  }),
  graphql.query('GetUsers', (req, res, ctx) => {
    return res(
      ctx.data({
        users: [
          {
            id: 1,
            name: 'Diego Manager',
            email: 'diego.manager@gmail.com',
            password: '12345678',
            roles: ['manager'],
          },
          {
            id: 2,
            name: 'Diego Normal',
            email: 'diego.normal@gmail.com',
            password: '87654321',
            roles: [],
          },
        ],
      })
    );
  }),
];
