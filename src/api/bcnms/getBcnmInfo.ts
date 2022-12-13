import { query } from '../../db';
import { cache } from '../../cache';

interface Bcnm {
  bcnmId: number;
  zoneId: number;
  zoneName: string;
  bcnmName: string;
  fastestName: string;
  fastestPartySize: number;
  fastestTime: number;
  timeLimit: number;
  levelCap: number;
  partySize: number;
  lootDropId: number;
  rules: string;
  isMission: number;
}

const getAllBcnmsQuery = `
SELECT 
	bi.bcnmId, 
	bi.zoneId,
	zs.name AS zoneName,
	bi.name AS bcnmName, 
	bi.fastestName, 
	bi.fastestPartySize, 
	bi.fastestTime, 
	bi.timeLimit, 
	bi.levelCap, 
	bi.partySize, 
	bi.lootDropId, 
	bi.rules, 
	bi.isMission
FROM bcnm_info bi
	LEFT JOIN zone_settings zs
		ON bi.zoneId = zs.zoneid
`;

const getBcnmById = `
SELECT
	bi.bcnmId,
	bi.zoneId,
	zs.name AS zoneName,
	bi.name AS bcnmName,
	bi.fastestName,
	bi.fastestPartySize,
	bi.fastestTime,
	bi.timeLimit,
	bi.levelCap,
	bi.partySize,
	bi.lootDropId,
	bi.rules,
	bi.isMission
FROM bcnm_info bi
	LEFT JOIN zone_settings zs
		ON bi.zoneId = zs.zoneid
WHERE bi.bcnmId = ?
`;

/**
 * Gets BCNM information
 * @param {number=} bcnmId Optional BCNM ID
 * @returns {Array} BCNM info
 */

const getBcnmInfo = async (bcnmId?: number): Promise<Bcnm[]> => {
  return cache.get(
    {
      key: `getAllBcnms`,
      ttl: 5 * 60 * 1000, // 5 minutes
    },
    async () => {
      try {
        const results: Bcnm[] = await query(bcnmId ? getBcnmById : getAllBcnmsQuery, [bcnmId]);
        return results;
      } catch (error) {
        console.log('[getAllBcnms error]: There was an error trying to get all bcnms.', error);
      }
    }
  );
};

export default getBcnmInfo;
