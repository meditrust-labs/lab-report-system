import {
  CACHE_NAME,
  TEST_REPORT_URL,
  FINAL_REPORT_URL,
  STAMP_URL,
} from "../constants";

const fetchAndCacheData = async (url) => {
  let cache;
  return caches
    .open(CACHE_NAME)
    .then((cacheStorage) => {
      cache = cacheStorage;
      return cacheStorage.add(url);
    })
    .then(() => {
      return cache.match(url);
    })
    .then((cachedResponse) => cachedResponse);
};

export const fetchCachedData = async (url) => {
  return caches
    .open(CACHE_NAME)
    .then((cacheStorage) => {
      return cacheStorage.match(url);
    })
    .then((cachedResponse) => {
      if (!cachedResponse || !cachedResponse.ok) {
        return fetchAndCacheData(url);
      }
      return cachedResponse;
    })
    .catch((err) => console.log(err));
};

export const cacheDataOnLoad = async () => {
  try {
    const cacheStorage = await caches.open(CACHE_NAME);
    const keys = await cacheStorage.keys();
    if (keys.length < 3) {
      await cacheStorage.addAll([TEST_REPORT_URL, FINAL_REPORT_URL, STAMP_URL]);
    }
  } catch (err) {
    console.log("Caching Error => ", err);
  }
};
