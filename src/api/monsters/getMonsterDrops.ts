import { query } from '../../db';
import { cache } from '../../cache';
import { Monster } from './getMonster';
import getMonsterDetail from './getMonsterDetail';

export interface ItemDrop {
    itemid: number;
    itemrate: number;
    itemname: string;
}

const getMonsterDropsQuery: string = `SELECT dl.itemid, dl.itemrate, COALESCE(ita.name, itb.name, itf.name, itp.name, itw.name) AS itemname FROM mob_droplist AS dl
    LEFT JOIN item_equipment AS ita ON dl.itemid = ita.itemid
    LEFT JOIN item_basic AS itb ON dl.itemid = itb.itemid
    LEFT JOIN item_furnishing AS itf ON dl.itemid = itf.itemid
    LEFT JOIN item_puppet AS itp ON dl.itemid = itp.itemid
    LEFT JOIN item_weapon AS itw ON dl.itemid = itw.itemid
    WHERE dropid = ?;`;


const getMonsterDrops = async (monster: Monster): Promise<{ error: string | null, data: ItemDrop[] | null }> => {
    return cache.get({
        key: `getMonsterDrops_${monster.dropid}`,
        ttl: 500
    }, async () => {
        try {
            var dropid: number = 0;
            if (monster.dropid === undefined) {
                const detail = (await getMonsterDetail(monster)).data;
                if (detail && detail.dropid) {
                    dropid = detail.dropid;
                }
            } else {
                dropid = monster.dropid;
            }
            if (!dropid) {
                return { error: `[getMonsterDrops error]: Cannot retrieve dropId for monster`, data: null };
            }
            const monsterDrops = await query(getMonsterDropsQuery, [dropid]);
            if (monsterDrops.length) {         
                return { error: null, data: monsterDrops };
            }
            return { error: null, data: null };
        }
        catch (error: any) {
            return { error: `[getMonsterDrops error]: ${error.message}`, data: null };
        }
    });
}

export default getMonsterDrops;