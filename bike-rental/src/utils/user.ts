import jwtDecode from 'jwt-decode';
import * as Storage from 'utils/storage.util';
import { AUTHENTICATION_TOKEN_KEY } from 'constants/storage.constant';
import { User } from 'types/user.type';

export const getUser = (): User => {
  const authToken = Storage.getItem<string>(AUTHENTICATION_TOKEN_KEY);
  const decodedToken = jwtDecode<{ data: User }>(authToken);
  return decodedToken.data;
};
