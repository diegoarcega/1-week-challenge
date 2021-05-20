import { name } from '../../package.json';

const STORAGE_PREFIX = `@${name}`;

export const AUTHENTICATION_TOKEN_KEY = `${STORAGE_PREFIX}/authentication/token`;
