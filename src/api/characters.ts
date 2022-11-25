/**
 * Functions ported from ArcanusDSP
 * https://github.com/atom0s/arcanusdsp/blob/4c5ba7346c587f658ae4339e61cc5279501ed339/arcanusdsp-services/services/darkstar/characters.js
 */
import { query } from '../db';
import { cache } from '../cache';
import { hasGmFlag, getLinkshellHtmlColor } from '../utils/characterUtils';
import {
  getOnlineCharactersQuery,
  getUniquePlayerCountQuery,
  getIdsByCharNameQuery,
  unstuckCharacterQuery,
  unstuckCharacterUpdateQuery,
} from './characters.queries';
import type {
  OnlineCharacter,
  GetIdsByCharNameReturnValue,
  UnstuckCharacter,
} from './characters.types';
import type { UpdateQuery } from '../types';

/**
 * Gets a list of current online characters.
 *
 * @param {function} done The callback to invoke when the function has completed.
 */
export const getOnlineCharacters = async (): Promise<OnlineCharacter[]> => {
  return cache.get(
    {
      key: 'getOnlineCharacters',
      ttl: 60000, // 1 minute cache
    },
    async () => {
      // Query the database for the online characters..
      try {
        const rows = await query<OnlineCharacter[]>(getOnlineCharactersQuery);
        const formattedRows = rows
          .filter((row) => {
            return (
              // Skip hidden players
              row.ishidden === 0 ||
              // Skip GMs that are anon (/anon)
              (row.gmlevel > 0 && (row.nameflags & 0x00001000) !== 0x00001000)
            );
          })
          .map((row) => {
            const newRow = { ...row };

            // Hide players GM status if their flag is off..
            if (!hasGmFlag(row.nameflags)) {
              newRow.gmlevel = 0;
            }

            // If GM hide LS info
            if (newRow.gmlevel > 0) {
              newRow.ls1name = '';
              newRow.ls2name = '';
              newRow.ls1color = 0;
              newRow.ls2color = 0;
            } else {
              // If not GM, convert LS colors to RGB values
              newRow.ls1color = getLinkshellHtmlColor(row.ls1color);
              newRow.ls2color = getLinkshellHtmlColor(row.ls2color);
            }

            return newRow;
          })
          .sort((char1: OnlineCharacter, char2: OnlineCharacter) => {
            var nameorder =
              char1.charname === char2.charname ? 0 : char1.charname < char2.charname ? -1 : 1;
            if (
              (char1.gmlevel > 0 && char2.gmlevel > 0) ||
              (char1.gmlevel === 0 && char2.gmlevel === 0)
            ) {
              return nameorder;
            } else if (char1.gmlevel > 0) {
              return -1;
            }
            return 1;
          });

        return formattedRows;
      } catch (error) {
        console.log('[getOnlineCharacters error]: ', error);
      }

      return [];
    }
  );
};

/**
 * Retrieves the number of unique online players (by unique ip)
 * Dual+ boxers will count as 1 if on the same ip.
 *
 * @returns {number} - the number of unique players online
 */
export const getUniquePlayerCount = async (): Promise<number> => {
  return cache.get(
    {
      key: 'getUniquePlayerCount',
      ttl: 5 * 60 * 1000, // 5 minutes
    },
    async () => {
      try {
        // Query the database for the online characters..
        const results = await query<{ count: number }[]>(getUniquePlayerCountQuery);
        return results[0].count;
      } catch (error) {
        console.log('[getUniquePlayerCount error]: ', error);
      }
      return 0;
    }
  );
};

/**
 * Retrieves the accid and charid for a provided charname.
 *
 * @param {string} charName - character name to search by
 * @returns {number} - the number of unique players online
 */
export const getIdsByCharName = async (charName: string): Promise<GetIdsByCharNameReturnValue> => {
  return cache.get(
    {
      key: `getIdsByCharName_${charName}`,
      // No point ever clearing this cache
      ttl: 0,
    },
    async () => {
      try {
        const results = await query<GetIdsByCharNameReturnValue[]>(getIdsByCharNameQuery, [
          charName,
        ]);
        if (results[0]) {
          return results[0];
        }
      } catch (error) {
        console.log(
          '[unstuckCharacter error]: There was an error trying to free your character.',
          error
        );
      }

      // Error or none found
      return { accid: -1, charid: -1 };
    }
  );
};

/**
 * Frees a stuck character.
 *
 * @param {string} charName - The character name to free.
 * @returns {boolean} - whether the character was freed or not
 */
export const unstuckCharacter = async (charName: string): Promise<boolean> => {
  return cache.get(
    {
      key: `unstuckCharacter_${charName}`,
      ttl: 5000, // 5 second cache to prevent double sends/writes
    },
    async () => {
      try {
        // Get the accid and charid for the provided char name
        const { accid, charid } = await getIdsByCharName(charName);

        if (accid === -1 || charid === -1) {
          console.log('No character found with this name.');
          return false;
        }

        // Get the current character position
        const [result] = await query<UnstuckCharacter[]>(unstuckCharacterQuery, [accid, charid]);

        // Ensure the character is not in jail..
        if (result.pos_zone === 131) {
          console.log('Cannot free your character; you are in jail.');
          return false;
        }

        // Void zone fix.. (loldspbug)
        const homeZone = result.home_zone;
        let prevZone = result.pos_prevzone;
        if (prevZone === 0) {
          prevZone = homeZone;
        }

        const updateResult = await query<UpdateQuery>(unstuckCharacterUpdateQuery, [
          homeZone,
          prevZone,
          result.home_rot,
          result.home_x,
          result.home_y,
          result.home_z,
          charid,
        ]);

        if (updateResult.affectedRows > 0) {
          return true;
        }
      } catch (error) {
        console.log(
          '[unstuckCharacter error]: There was an error trying to free your character.',
          error
        );
      }
      return false;
    }
  );
};
