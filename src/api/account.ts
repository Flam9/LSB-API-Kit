import { query } from '../db';
import { cache } from '../cache';
import {
  banPlayerByAccIdQuery,
  unbanPlayerByAccIdQuery,
  getAccIdByUserNameQuery,
  deleteSessionByAccIdQuery,
} from './account.queries';
import type { AccountId } from './account.types';
import type { UpdateQuery } from '../types';

/**
 * Gets Account Id by Username
 *
 * @param {string} userName The user name / login of the account
 * @returns {number} - if -1 then no Account Id Found
 */
export const getAccountIdByUserName = async (userName: string): Promise<number> => {
  return cache.get(
    {
      key: `getAccountByUserName_${userName}`,
      ttl: 0, // No Cache
    },
    async () => {
      try {
        const result = await query<AccountId[]>(getAccIdByUserNameQuery, [userName]);
        if (result[0] === undefined) {
          return -1;
        }
        return result[0].accId;
      } catch (error) {
        console.log(error);
        console.log(`There was an error on getAccountIdByUserName - ${error}`);
      }
    }
  );
};

/**
 * Bans Account by Account Id
 *
 * @param {string} userName  The user name / login of the account
 * @returns {string} Result Message
 */
export const banPlayerByAccId = async (userName: string) => {
  return cache.get(
    {
      key: `banPlayerByAccId_${userName}`,
      ttl: 0, // No Cache
    },
    async () => {
      try {
        const accId = await getAccountIdByUserName(userName);
        if (accId === -1) {
          return `No Account Id Found`;
        }

        const updateResult = await query<UpdateQuery>(banPlayerByAccIdQuery, [accId]);
        if (updateResult.affectedRows === 0) {
          return `Player is already Banned`;
        }

        const deleteResult = await query<UpdateQuery>(deleteSessionByAccIdQuery, [accId]);
        if (deleteResult.affectedRows > 0) {
          return `Player is banned and session was deleted`;
        }

        return `Player is banned and does not have an active session`;
      } catch (error) {
        console.log(`There was an error on banPlayerByAccId - ${error}`);
      }
    }
  );
};

/**
 * Unbans Account by User Name
 *
 * @param {string} userName  The user name / login of the account
 * @returns {string} Result Message
 */
export const unbanPlayerByAccId = async (userName: string) => {
  return cache.get(
    {
      key: `unbanPlayerByAccId_${userName}`,
      ttl: 0, // No Cache
    },
    async () => {
      try {
        const accId = await getAccountIdByUserName(userName);
        if (accId === -1) {
          return `No Account Id Found`;
        }

        const updateResult = await query<UpdateQuery>(unbanPlayerByAccIdQuery, [accId]);
        if (updateResult.affectedRows > 0) {
          return `Player is unbanned`;
        }

        return `Player is not currently Banned`;
      } catch (error) {
        console.log(`There was an error on unbanPlayerByAccId - ${error}`);
      }
    }
  );
};

/**
 * Kills Session by User Name
 *
 * @param {string} userName  The user name / login of the account
 * @returns {string} Result Message
 */
export const killPlayerSession = async (userName: string) => {
  return cache.get(
    {
      key: `killPlayerSession${userName}`,
      ttl: 0, // No Cache
    },
    async () => {
      try {
        const accId = await getAccountIdByUserName(userName);
        if (accId === -1) {
          return `No Account Id Found`;
        }

        const deleteResult = await query<UpdateQuery>(deleteSessionByAccIdQuery, [accId]);
        if (deleteResult.affectedRows > 0) {
          return `Player session was deleted`;
        }

        return `Player does not have an active session`;
      } catch (error) {
        console.log(`There was an error on banPlayerByAccId - ${error}`);
      }
    }
  );
};