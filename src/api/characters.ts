import { query } from '../db';
import { cache } from '../cache';
import { hasGmFlag, getLinkshellHtmlColor } from '../utils/characterUtils';
import { getOnlineCharactersQuery, getUniquePlayerCountQuery } from './characters.queries';
import type { OnlineCharacter } from './characters.types';

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
        const rows = await query<OnlineCharacter>(getOnlineCharactersQuery);
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

export const getUniquePlayerCount = async (): Promise<number> => {
  return cache.get(
    {
      key: 'getUniquePlayerCount',
      ttl: 5 * 60 * 1000, // 5 minutes
    },
    async () => {
      try {
        // Query the database for the online characters..
        const results = await query<{ count: number }>(getUniquePlayerCountQuery);
        return results[0].count;
      } catch (error) {
        console.log('[getUniquePlayerCount error]: ', error);
      }
      return 0;
    }
  );
};
