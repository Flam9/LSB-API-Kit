import { query } from '../../db';
import { cache } from '../../cache';
import getIdsByCharacterName from './getIdsByCharacterName';
import type { UpdateQuery } from '../../types';
import type { CharacterIds } from './getIdsByCharacterName';

interface UnstuckCharacter {
  accid: number;
  charid: number;
  charname: string;
  pos_zone: number;
  pos_prevzone: number;
  pos_rot: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  home_zone: number;
  home_rot: number;
  home_x: number;
  home_y: number;
  home_z: number;
  bans: number;
}

const getCurrentPositionQuery = `SELECT c.accid, c.charid, c.charname, c.home_zone, c.pos_zone, c.pos_prevzone, c.pos_rot, c.pos_x, c.pos_y, c.pos_z, c.home_rot, c.home_x, c.home_y, c.home_z, COUNT(ab.accid) AS bans FROM chars AS c
LEFT JOIN accounts_banned AS ab ON ab.accid = c.accid
WHERE c.accid = ? AND c.charid = ?;`;

const unstuckCharacterUpdateQuery =
  'UPDATE chars SET pos_zone = ?, pos_prevzone = ?, pos_rot = ?, pos_x = ?, pos_y = ?, pos_z = ? WHERE charid = ?;';

/**
 * Frees a stuck character.
 *
 * @param {string} charName - The character name to free.
 * @returns {boolean} - whether the character was freed or not
 */
export const unstuckCharacter = async (
  charName: string
): Promise<{ error: string | null; data: boolean | null }> => {
  return cache.get(
    {
      key: `unstuckCharacter_${charName}`,
      ttl: 5000, // 5 second cache to prevent double sends/writes
    },
    async () => {
      try {
        // Get the accid and charid for the provided char name
        const { error, data } = await getIdsByCharacterName(charName);
        if (error) {
          throw new Error(error);
        }

        const { accid, charid } = data as CharacterIds;

        if (accid === -1 || charid === -1) {
          return { error: null, data: false };
        }

        // Get the current character position
        const [result] = await query<UnstuckCharacter[]>(getCurrentPositionQuery, [accid, charid]);

        // Ensure the character is not in jail..
        if (result.pos_zone === 131) {
          return { error: null, data: false };
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
          return { error: null, data: true };
        }
        return { error: null, data: false };
      } catch (error: any) {
        return { error: `[unstuckCharacter]: ${error.message}`, data: null };
      }
    }
  );
};

export default unstuckCharacter;
