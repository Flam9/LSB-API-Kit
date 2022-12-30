import { query } from '../../db';

export interface AccountType {
  id: number;
  login: string;
  status: number;
  priv: number;
  gmLevel: number;
}

const getAccountTypeQuery = `
SELECT 
	id,
	login,
	status, 
	priv,
	(SELECT gmlevel FROM chars WHERE accid = a.id ORDER BY gmlevel DESC LIMIT 1) AS 'gmLevel'
FROM accounts a
WHERE status = 1 AND login = ? AND password = PASSWORD(?);
`;

/**
 * Gets account type by login and password
 * @param {string} login Submit login name
 * @param {string} password Submit password
 *
 * @returns {object} Account type
 */

const getAccountType = async (
  login: string,
  password: string
): Promise<{ error: string | null; data: AccountType | string | null }> => {
  try {
    const results: AccountType[] = await query(getAccountTypeQuery, [login, password]);

    if (results[0]) {
      return { error: null, data: results[0] };
    }
    return { error: null, data: `Account not found.` };
  } catch (error: any) {
    return { error: `[getAccountType]: ${error.message}`, data: null };
  }
};

export default getAccountType;
