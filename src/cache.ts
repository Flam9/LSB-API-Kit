import NodeCache from 'node-cache';
import type { Options } from 'node-cache';

class Cache {
  private cache;

  constructor({ stdTTL = 30000 }: Options) {
    this.cache = new NodeCache({
      stdTTL,
      checkperiod: stdTTL * 0.2,
      // eg: https://runkit.com/mpneuried/useclones-example-83
      useClones: true, // a lil slower, but I don't trust people to not mutate the data and cause rando bugs. Still fast enough.
    });
  }

  async get({ key, ttl }: { key: string; ttl?: number }, updateFunction: () => Promise<any>) {
    const now = Date.now();
    const oldTtl = this.getTtl(key);

    // If it's out of date or not in the cache, update and return the new value
    if (!oldTtl || (oldTtl && now >= oldTtl)) {
      const newValue = await updateFunction();
      console.log('stale');

      if (ttl) {
        this.cache.set(key, newValue, ttl);
      } else {
        this.cache.set(key, newValue);
      }

      return newValue;
    }

    // Return the cached value
    return this.cache.get(key);
  }

  /**
   * Receive the ttl of a key.
   *
   * @param {string} key
   * @returns {undefined, number} undefined if the key does not exist, 0 if this key has no ttl, a timestamp in ms representing the time at which the key will expire
   */
  getTtl(key: string): undefined | number {
    return this.cache.getTtl(key);
  }

  /**
   * Deletes cache for a specific key.
   *
   * @param {string} key - the key to delete
   * @returns {number} - the number of deleted entries
   */
  del(key: string = ''): number {
    if (!key) {
      return 0;
    }
    return this.cache.del(key);
  }

  /**
   * Delete cache for any key beginning with provided string.
   * Useful for delete all cache for a dynamic route, eg: users/:id
   *
   * @param {string} startStr - what the key starts with
   * @returns {number} - the number of deleted entries
   */
  delStartWith(startStr: string = ''): number {
    if (!startStr) {
      return 0;
    }

    let deleteCount = 0;
    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.startsWith(startStr)) {
        this.del(key);
        deleteCount++;
      }
    }

    return deleteCount;
  }

  /**
   * Clears the entire cache.
   */
  flush() {
    this.cache.flushAll();
  }
}

// TODO change
export const cache = new Cache({ stdTTL: 30000 });
