import { config } from 'config/config';
import { gql, request } from 'graphql-request';
import { User } from '../types/user.type';

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

export function createAccount({
  name,
  email,
  password,
}: {
  name: User['name'];
  email: User['email'];
  password: string;
}): Promise<User> {
  return request(
    config.baseApiUrl,
    gql`
      mutation CreateUser($name: String!, $email: String!, $password: String!) {
        user {
          id
          name
          email
          roles
        }
      }
    `,
    {
      name,
      email,
      password,
    }
  );
}
