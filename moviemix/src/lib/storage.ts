import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'moviemix-cache',
});

export function setCache<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function getCache<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (!raw) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function removeCache(key: string) {
  storage.delete(key);
}
