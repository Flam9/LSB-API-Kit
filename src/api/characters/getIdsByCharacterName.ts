import { query } from '../../db';
import { cache } from '../../cache';

export type CharacterIds = { accid: number; charid: number };

const getIdsByCharacterNameQuery = `SELECT accid, charid FROM chars WHERE charname = ?`;

/**
 * Retrieves the accid and charid for a provided characterName.
 *
 * @param {string} characterName - character name to search by
 * @returns {object} - the account id and character id
 */
export const getIdsByCharacterName = async (
  characterName: string
): Promise<{ error: string | null; data: CharacterIds | null }> => {
  return cache.get(
    {
      key: `getIdsByCharacterName_${characterName}`,
      ttl: 10 * 60 * 1000, // 10 minutes
    },
    async () => {
      try {
        const results = await query<CharacterIds[]>(getIdsByCharacterNameQuery, [characterName]);
        if (results[0]) {
          return { error: null, data: results[0] };
        }
        return { error: null, data: {accid: -1, charid: -1} };
      } catch (error: any) {
        return { error: `[getIdsByCharacterName]: ${error.message}`, data: null };
      }
    }
  );
};

export default getIdsByCharacterName;
