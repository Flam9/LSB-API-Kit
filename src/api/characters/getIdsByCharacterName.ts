import { query } from '../../db';
import { cache } from '../../cache';

type CharacterIds = { accid: number; charid: number };

const getIdsByCharacterNameQuery = `SELECT accid, charid FROM chars WHERE charname = ?`;

/**
 * Retrieves the accid and charid for a provided characterName.
 *
 * @param {string} characterName - character name to search by
 * @returns {object} - the account id and character id
 */
export const getIdsByCharacterName = async (characterName: string): Promise<CharacterIds> => {
  return cache.get(
    {
      key: `getIdsByCharacterName_${characterName}`,
      ttl: 10 * 60 * 1000, // 10 minutes
    },
    async () => {
      try {
        const results = await query<CharacterIds[]>(getIdsByCharacterNameQuery, [characterName]);
        return results[0];
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

export default getIdsByCharacterName;
