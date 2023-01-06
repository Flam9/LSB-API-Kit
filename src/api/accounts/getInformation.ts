import { query } from '../../db';
import { cache } from '../../cache';
export interface Account {
  id: number;
  login: string;
  current_email: string;
  registration_email: string;
  timecreate: Date;
  timelastmodify: Date;
  content_ids: string;
  expansions: string;
  features: string;
  status: number;
  priv: number;
}

const getAccountInfoByUsernameQuery = `SELECT id, login, current_email, registration_email, timecreate, timelastmodify, content_ids, expansions, features, status, priv FROM accounts where login = ?;`;
const getAccountInfoByIdQuery = `SELECT id, login, current_email, registration_email, timecreate, timelastmodify, content_ids, expansions, features, status, priv FROM accounts where id = ?;`;

/**
 * Gets account info by login login name or account id
 * @param {string | number} searchTerm Submit login name or account id
 * @returns {object} Account info
 */

const getAccountInfo = async (
  searchTerm: string | number
): Promise<{ error: string | null; data: Account | null | string }> => {
  return cache.get(
    {
      key: `getAccountInfo_${searchTerm}`,
      ttl: 500,
    },
    async () => {
      try {
        const results: Account[] = await query(
          typeof searchTerm === 'string' ? getAccountInfoByUsernameQuery : getAccountInfoByIdQuery,
          [searchTerm]
        );
        if (results[0]) {
          return { error: null, data: results[0] };
        }
        return { error: null, data: `account not found` };
      } catch (error: any) {
        return { error: `[getAccountInfo]: ${error.message}`, data: null };
      }
    }
  );
};

export default getAccountInfo;
