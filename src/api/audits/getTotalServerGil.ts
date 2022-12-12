import { query } from '../../db';
import { cache } from '../../cache';

type TotalGil = { quantity: number };

const getTotalServerGilQuery = `
select sum(ci.quantity) as 'quantity'
from char_inventory ci
inner join chars c on c.charid = ci.charid
inner join accounts a on c.accid = a.id
where a.status = 1;
`;

/**
 * Gets Total Gil on the Server excluding Delivery Box Gil
 *
 * @returns {number} Total Gil
 */

const getTotalServerGil = async (): Promise<number> => {
  return cache.get(
    {
      key: `getTotalServerGil`,
      ttl: 5 * 60 * 1000, // 5 Minute cache
    },
    async () => {
      try {
        const result: TotalGil[] = await query(getTotalServerGilQuery);
        if (result[0] === undefined) {
          return 0;
        }
        return result[0].quantity;
      } catch (error) {
        console.log(`[getTotalServerGil error]: `, error);
      }
    }
  );
};

export default getTotalServerGil;
