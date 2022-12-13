import { query } from '../../db';
import { cache } from '../../cache';

const getUniqueCharacterCountQuery = `SELECT COUNT(DISTINCT(client_addr)) AS count FROM accounts_sessions;`;

/**
 * Retrieves the number of unique online Characters (by unique ip)
 * Dual+ boxers will count as 1 if on the same ip.
 *
 * @returns {number} - the number of unique Characters online
 */
export const getUniqueCharacterCount = async (): Promise<number> => {
  return cache.get(
    {
      key: 'getUniqueCharacterCount',
      ttl: 5 * 60 * 1000, // 5 minutes
    },
    async () => {
      try {
        // Query the database for the online characters..
        const results: { count: number }[] = await query(getUniqueCharacterCountQuery);
        return results[0].count;
      } catch (error) {
        console.log('[getUniqueCharacterCount error]: ', error);
      }
      return 0;
    }
  );
};

export default getUniqueCharacterCount;
