import { query } from '../../db';
import { cache } from '../../cache';

interface TotalGilByAccount {
  accid: number;
  login: string;
  quantity: number;
}

const getTopGilByAccountQuery = `
select
	a.id as 'accId',
	a.login,
	sum(ci.quantity) as 'quantity'
from char_inventory ci
inner join chars c on c.charid = ci.charid
inner join accounts a on c.accid = a.id
where ci.itemId = 65535
group by a.id, a.login
order by ci.quantity desc
limit ?;
`;

/**
 * Gets top Accounts with the most Gil
 * @param {number} limit - Limit of results
 * @returns {Array<>} list of characters
 */

const getTopGilByAccount = async (limit: number): Promise<TotalGilByAccount[]> => {
  return cache.get(
    {
      key: `getTopGilByAccount:${limit}`,
      ttl: 5 * 60 * 1000, // 5 Minute cache
    },
    async () => {
      try {
        const result: TotalGilByAccount[] = await query(getTopGilByAccountQuery, [limit]);
        return result;
      } catch (error) {
        console.log(`[getTopGilByAccount error]: `, error);
      }
    }
  );
};

export default getTopGilByAccount;
