import { AUTHENTICATION_TOKEN_EXPIRED } from 'constants/authentication.constant';
import { AUTHENTICATION_TOKEN_KEY } from 'constants/storage.constant';
import { GraphQLClient } from 'graphql-request';
import jwtDecode from 'jwt-decode';
import * as Storage from 'utils/storage.util';
import EventEmitter from 'utils/event-emitter.utils';
import { config } from 'config/config';

const client = new GraphQLClient(config.baseApiUrl);
interface Api {
  isPublic?: boolean;
  query: string;
  variables?: Record<string, unknown>;
}

export function api<T>({ query, variables, isPublic }: Api): Promise<T> {
  try {
    if (isPublic) {
      return client.request(query, variables);
    }

    const authToken = getValidatedToken();
    return client.request(query, variables, {
      authorization: authToken,
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

function getValidatedToken() {
  const authToken = Storage.getItem<string>(AUTHENTICATION_TOKEN_KEY);

  if (!isTokenValid(authToken)) {
    EventEmitter.emit(AUTHENTICATION_TOKEN_EXPIRED);
    throw new Error('Token is invalid');
  }

  return authToken;
}

function isTokenValid(token: string): boolean {
  const decodedToken = jwtDecode<{ exp: number }>(token);
  const isExpired = decodedToken.exp * 1000 < Date.now();
  return !isExpired;
}
