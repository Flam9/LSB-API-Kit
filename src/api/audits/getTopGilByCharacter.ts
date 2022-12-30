import { query } from '../../db';
import { cache } from '../../cache';

interface TotalGilByCharacter {
  charid: number;
  accid: number;
  charname: string;
  quantity: number;
}

const getTopGilByCharacterQuery = `
select
	c.charid,
	c.accid,
	c.charname,
	ci.quantity
from char_inventory ci
inner join chars c on c.charid = ci.charid
where ci.itemId = 65535
order by ci.quantity desc
limit ?;
`;

/**
 * Gets top Characters with the most Gil
 * @param {number} limit - Limit of results
 * @return {Array<>} list of characters
 */

const getTopGilByCharacter = async (
  limit: number
): Promise<{ error: string | null; data: TotalGilByCharacter[] | null }> => {
  return cache.get(
    {
      key: `getTopGilByCharacter:${limit}`,
      ttl: 5 * 60 * 1000, // 5 Minute cache
    },
    async () => {
      try {
        const result: TotalGilByCharacter[] = await query(getTopGilByCharacterQuery, [limit]);
        return { error: null, data: result };
      } catch (error: any) {
        return { error: `[getTopGilByCharacter]: ${error.message}`, data: null };
      }
    }
  );
};

export default getTopGilByCharacter;
