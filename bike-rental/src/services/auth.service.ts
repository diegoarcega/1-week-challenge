import api from './api';
import { USER_MANAGER, USER } from '../mocks/users';
import * as Storage from '../utils/storage.util';
import { User } from '../types/user.type';

export function login({ email, password }: { email?: User['email']; password?: string }): Promise<User> {
  return new Promise((resolve, reject) => {
    if (email === USER_MANAGER.email && password === USER_MANAGER.password) {
      resolve({
        id: USER_MANAGER.id,
        name: USER_MANAGER.name,
        email: USER_MANAGER.email,
        roles: USER_MANAGER.roles,
      });
    }
    if (email === USER.email && password === USER.password) {
      resolve({
        id: USER.id,
        name: USER.name,
        email: USER.email,
        roles: USER.roles,
      });
    }

    reject(new Error('Invalid email or password'));
  });
}

export function createAccount({
  name,
  email,
  password,
}: {
  name: User['name'];
  email: User['email'];
  password: string;
}): Promise<Pick<User, 'email' | 'id' | 'name'>> {
  return new Promise((resolve, reject) => {
    if (email && password && name) {
      resolve({
        id: String(Math.random()),
        name,
        email,
      });
    }

    reject(new Error('Could not create this account'));
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
