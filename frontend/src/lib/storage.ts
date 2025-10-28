import { ENV } from '@/constants/api';

const PREFIX = ENV === 'development' ? 'dev_' : '';

export const storage = {
  getItem: (key: string): string | null => {
    return localStorage.getItem(`${PREFIX}${key}`);
  },

  setItem: (key: string, value: string): void => {
    localStorage.setItem(`${PREFIX}${key}`, value);
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`${PREFIX}${key}`);
  },

  clear: (): void => {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  },
};
