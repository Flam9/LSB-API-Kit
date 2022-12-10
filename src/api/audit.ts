import { query } from '../db';
import { cache } from '../cache';
import {
  totalServerGilQuery,
  topTenCharactersByGilQuery,
  topTenAccountsByGilQuery,
} from './audit.queries';

import type { TotalGilByCharacter, TotalGilByAccount, TotalGil } from './audit.types';

/**
 * Gets Total Gil on the Server excluding Delivery Box Gil
 *
 * @returns {number} Total Gil
 */
export const getTotalServerGil = async (): Promise<number> => {
  return cache.get(
    {
      key: `getTotalServerGil`,
      ttl: 300, // 5 Minute cache
    },
    async () => {
      try {
        const result = await query<TotalGil[]>(totalServerGilQuery);
        if (result[0] === undefined) {
          return 0;
        }
        return result[0].quantity;
      } catch (error) {
        console.log(error);
        console.log(`There was an error on getTotalServerGil - ${error}`);
      }
    }
  );
};

/**
 * Gets Top Ten Accounts that have the most Gil
 *
 * @returns Total Array of Accounts
 */
export const getTopTenAccountsByGil = async (): Promise<TotalGilByAccount[]> => {
  return cache.get(
    {
      key: `getTopTenAccountsByGil`,
      ttl: 300, // 5 Minute cache
    },
    async () => {
      try {
        const result = await query<TotalGilByAccount[]>(topTenAccountsByGilQuery);

        return result;
      } catch (error) {
        console.log(error);
        console.log(`There was an error on getTopTenAccountsByGil - ${error}`);
      }
    }
  );
};

/**
 * Gets Top Ten Characters that have the most Gil
 *
 * @returns Total Array of Characters
 */
export const getTopTenCharactersByGil = async (): Promise<TotalGilByAccount[]> => {
  return cache.get(
    {
      key: `getTopTenCharactersByGil`,
      ttl: 300, // 5 Minute cache
    },
    async () => {
      try {
        const result = await query<TotalGilByCharacter[]>(topTenCharactersByGilQuery);

        return result;
      } catch (error) {
        console.log(error);
        console.log(`There was an error on getTopTenCharactersByGil - ${error}`);
      }
    }
  );
};
