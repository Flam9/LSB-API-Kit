import { query } from '../../db';
import getAccountInfo, { Account } from './getInformation';
import { UpdateQuery } from '../../types';

const deleteSessionQuery = `DELETE FROM accounts_sessions WHERE accId = ?;`;

/**
 * Delete all sessions for an account
 * @param {string | number} searchTerm Submit login name or account id
 * @returns {string} Returns message on actions taken
 */

const deleteSession = async (
  searchTerm: string | number
): Promise<{ error: string | null; data: string | null }> => {
  try {
    const { error, data } = await getAccountInfo(searchTerm);
    if (error) {
      throw new Error(error);
    }

    if (data === `account not found`) {
      return { error: null, data: `account not found` };
    }

    const account: Account = data as Account;

    const deleteResult: UpdateQuery = await query(deleteSessionQuery, [account.id]);
    if (deleteResult.affectedRows > 0) {
      return { error: null, data: `all sessions have been deleted` };
    }
    return { error: null, data: `no sessions found` };
  } catch (error: any) {
    return { error: `[deleteSession]: ${error.message}`, data: null };
  }
};

export default deleteSession;
