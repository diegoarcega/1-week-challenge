import api from './api';
import { USER_MANAGER, USER } from '../__mocks__/users';
import * as Storage from '../utils/storage.util';
import { User } from '../types/user.type';

export function login({ email, password }: { email?: string; password?: string }): Promise<User | Error> {
  return new Promise((resolve, reject) => {
    if (email === USER_MANAGER.email && password === USER_MANAGER.password) {
      resolve(JSON.parse(JSON.stringify(USER_MANAGER, ['id', 'name', 'email', 'roles'])));
    }
    if (email === USER.email && password === USER.password) {
      resolve(JSON.parse(JSON.stringify(USER, ['id', 'name', 'email', 'roles'])));
    }

    reject(new Error('Invalid email or password'));
  });
}

export async function logout(): Promise<void> {
  Storage.clear();
  api.interceptors.request.use((config) => {
    return {
      ...config,
      headers: {
        ...config.headers,
        authorization: undefined,
      },
    };
  });
}
