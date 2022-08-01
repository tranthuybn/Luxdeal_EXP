/**
 * Configure the local storage method of the browser to directly store the array of objects.
 */

//The CacheStorage interface represents the storage for Cache objects.
import WebStorageCache from 'web-storage-cache'

type CacheType = 'sessionStorage' | 'localStorage'

export const useCache = (type: CacheType = 'localStorage') => {
  const wsCache: WebStorageCache = new WebStorageCache({
    storage: type
  })

  return {
    wsCache
  }
}
