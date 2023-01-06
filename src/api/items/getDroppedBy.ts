import { query } from '../../db';
import { cache } from '../../cache';
import { Item } from './getItem';

export interface MonsterDrop {
    mobid: number;
    itemRate: number;
    groupRate: number;
    itemid: number;
    zoneid: number;
    zonename: string;
    mobname: string;
    polutils_name: string;
    pos_x: number;
    pos_y: number;
    pos_z: number;
}

const getDroppedByQuery = `SELECT sp.mobid, dl.itemid, dl.itemRate, dl.groupRate, g.zoneid, sp.mobname, sp.polutils_name, sp.pos_x, sp.pos_y, sp.pos_z, z.name AS zonename FROM mob_droplist as dl
    LEFT JOIN mob_groups AS g ON dl.dropid = g.dropid
    LEFT JOIN mob_spawn_points AS sp ON g.groupid = sp.groupid
    LEFT JOIN zone_settings AS z ON g.zoneid = z.zoneid
    WHERE itemid = ? ORDER BY polutils_name ASC;`;

const getDroppedBy = async (item: Item): Promise<{ error: string | null; data: MonsterDrop[] | null }> => {
    return cache.get({
        key: `getSaleAuctionData_${item.itemid}`,
        ttl: 500,
    }, async () => {
        try {
            const results: MonsterDrop[] = await query(getDroppedByQuery, [item.itemid]);
            if (results.length) {
                return { error: null, data: results };
            }
            return { error: null, data: null };
        } catch (error: any) {
            return { error: `[getDroppedBy error]: ${error.message}`, data: null };
        }
    });
}

export default getDroppedBy;