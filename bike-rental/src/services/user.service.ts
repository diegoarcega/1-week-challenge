import { request, gql } from 'graphql-request';
import { config } from 'config/config';
import { User } from 'types/user.type';
import { api } from 'services/api';

// TODO: refactor all api to use the helper

export function getUser(userId: User['id']): Promise<{ user: User }> {
  const query = gql`
    query GetUser($userId: String!) {
      user {
        id
        name
        email
        roles
      }
    }
  `;
  const variables = {
    userId,
  };

  return api<{ user: User }>({ query, variables });
}

export function getAllUsers(): Promise<{ users: User[] }> {
  return request(
    config.baseApiUrl,
    gql`
      query GetUsers {
        users {
          id
          name
          email
          roles
        }
      }
    `
  );
}

export function deleteUser(userId: User['id']): Promise<{ users: User[] }> {
  return request(
    config.baseApiUrl,
    gql`
      mutation DeleteUser($userId: String!) {
        users {
          id
          name
          email
          roles
        }
      }
    `,
    {
      userId,
    }
  );
}

export function editUser(user: User): Promise<{ user: User }> {
  return request(
    config.baseApiUrl,
    gql`
      mutation EditUser($userId: String!) {
        users {
          id
          name
          email
          roles
        }
      }
    `,
    {
      user,
    }
  );
}
