/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import axios from 'axios';
import * as AuthenticationUtils from '../utils/authentication.util';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

api.interceptors.request.use((config) => {
  const newConfig = config;

  if (AuthenticationUtils.isAuthenticated() && !newConfig.headers.authorization) {
    newConfig.headers.authorization = AuthenticationUtils.getToken();
  }

  return newConfig;
});

api.interceptors.response.use(
  (response) => Promise.resolve(response),
  (error) => {
    if (error.message === 'Network Error') {
      const currentToken = AuthenticationUtils.getToken();
      const isTokenValid = currentToken && AuthenticationUtils.isTokenValid(currentToken);

      if (!isTokenValid) {
        // EventEmmiter.emit(AuthenticationConstants.AUTHENTICATION_TOKEN_EXPIRED);
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error.response.data);
  }
);

export default api;
