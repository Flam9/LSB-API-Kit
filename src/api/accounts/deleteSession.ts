import { query } from '../../db';
import getAccountInfo, { Account } from './getInformation';
import { UpdateQuery } from '../../types';

const deleteSessionQuery = `DELETE FROM accounts_sessions WHERE accId = ?;`;

/**
 * Delete all sessions for an account
 * @param {string | number} searchTerm Submit login name or account id
 * @returns {string} Returns message on actions taken
 */

const deleteSession = async (searchTerm: string | number): Promise<string> => {
  try {
    const account: Account = await getAccountInfo(searchTerm);

    if (!account) {
      return `Account not found.`;
    }

    const deleteResult: UpdateQuery = await query(deleteSessionQuery, [account.id]);
    if (deleteResult.affectedRows > 0) {
      return `All sessions have been deleted.`;
    }

    return `No sessions found.`;
  } catch (error: any) {
    console.log(
      '[deleteSession error]: There was an error trying to delete sessions.',
      error.message
    );
    return error.message;
  }
};

export default deleteSession;
