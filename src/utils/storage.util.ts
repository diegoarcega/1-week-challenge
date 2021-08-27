import * as StorageConstant from '../constants/storage.constant';

export function removeItem(key: string): void {
  window.localStorage.removeItem(key);
}

export function getItem<T>(key: string): T {
  let parsedItem = null;

  try {
    parsedItem = window.localStorage.getItem(key);

    if (parsedItem) {
      parsedItem = JSON.parse(parsedItem);
    }
  } catch {
    parsedItem = null;
  }

  return parsedItem as T;
}

export function setItem(key: string, value: unknown): void | Error {
  let stringifiedValue = value;

  try {
    stringifiedValue = JSON.stringify(stringifiedValue);
  } catch {
    throw new Error(`Could not stringify value`);
  }

  window.localStorage.setItem(key, stringifiedValue as string);
}

export function clear(): void {
  window.localStorage.removeItem(StorageConstant.AUTHENTICATION_TOKEN_KEY);
}
