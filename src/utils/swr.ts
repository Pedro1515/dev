import { fetcher } from "src/utils/axios";
import { mutate, cache } from "swr";

export function mutateFromCache(urlKey: string) {
  cache.keys().forEach((key) => {
    if (key.includes(urlKey)) {
      mutate(key);
    }
  });
}

export function fetchAndCache(key) {
  const request = fetcher(key);
  mutate(key, request, false);
  return request;
}
