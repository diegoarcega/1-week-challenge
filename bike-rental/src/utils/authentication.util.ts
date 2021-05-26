import jwtDecode from 'jwt-decode';
import { AUTHENTICATION_TOKEN_KEY } from '../constants/storage.constant';
import * as Storage from './storage.util';

export function getToken(): string {
  return Storage.getItem(AUTHENTICATION_TOKEN_KEY);
}

export function setToken(token: string): void | Error {
  return Storage.setItem(AUTHENTICATION_TOKEN_KEY, token);
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (token) {
    return isTokenValid(token);
  }
  return false;
}

export function isTokenValid(token: string): boolean {
  const decodedToken = jwtDecode<{ exp: number }>(token);
  const isExpired = decodedToken.exp * 1000 < Date.now();

  if (isExpired) {
    return false;
  }

  return true;
}
