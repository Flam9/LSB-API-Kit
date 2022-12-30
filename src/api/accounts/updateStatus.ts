import { query } from '../../db';
import { cache } from '../../cache';
import getAccountInfo, { Account } from './getInformation';
import type { UpdateQuery } from '../../types';

type Status = 'Active' | 'Banned';

const updateStatusQuery = `UPDATE accounts SET status = ? WHERE id = ?;`;
const deleteSessionByAccIdQuery = `DELETE FROM accounts_sessions WHERE accid = ?;`;

/**
 * Update Account Status to Active or Banned
 * @param {string | number} searchTerm Submit login name or account id
 * @param {string} status Submit Active or Banned
 * @returns {string} Returns message on actions taken
 */

const updateStatus = async (
  searchTerm: string | number,
  status: Status
): Promise<{ error: string | null; data: string | null }> => {
  return cache.get(
    {
      key: `updateStatus_${searchTerm}`,
      ttl: 0,
    },
    async () => {
      try {
        const statusId = status === 'Active' ? 1 : 2;
        const { error, data } = await getAccountInfo(searchTerm);
        if (error) {
          throw new Error(error);
        }

        if (data === `account not found`) {
          return { error: null, data: `account not found` };
        }
        const account: Account = data as Account;

        if (account.status === statusId) {
          return { error: null, data: `account is already ${status}` };
        }

        const updateStatus: UpdateQuery = await query(updateStatusQuery, [statusId, account.id]);

        if (status === 'Banned' && updateStatus.affectedRows > 0) {
          const deleteResult: UpdateQuery = await query(deleteSessionByAccIdQuery, [account.id]);
          if (deleteResult.affectedRows > 0) {
            return {
              error: null,
              data: `account has been banned and all sessions have been deleted`,
            };
          }
        }
        return { error: null, data: `account status has been updated to ${status}` };
      } catch (error: any) {
        return { error: `[updateStatus]: ${error.message}`, data: null };
      }
    }
  );
};

export default updateStatus;
