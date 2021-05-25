import { config } from 'config/config';
import { gql, request } from 'graphql-request';
import { User } from '../types/user.type';
import { api } from './api';

export function login({ email, password }: { email: User['email']; password: string }): Promise<{
  token: string;
  user: User;
}> {
  return request(
    config.baseApiUrl,
    gql`
      mutation LoginUser($email: String!, $password: String!) {
        token
        user
      }
    `,
    {
      email,
      password,
    }
  );
}

export interface CreateAccount extends Pick<User, 'name' | 'email'> {
  password: string;
  roles?: User['roles'];
}
export function createAccount({ name, email, password, roles }: CreateAccount): Promise<{ token: string }> {
  const query = gql`
    mutation CreateAccount($name: String!, $email: String!, $password: String!) {
      token
    }
  `;

  const variables = {
    name,
    email,
    password,
    roles,
  };

  return api({ query, variables, isPublic: true });
}
