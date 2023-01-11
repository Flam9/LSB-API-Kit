import { query } from '../../db';
import { cache } from '../../cache';
import { Item } from './getItem';

export interface BazaarItem {
    charid: number;
    charname: string;
    itemid: number;
    bazaar: number;
    itemname: string;
}

const getForSaleBazaarQuery = `SELECT c.charid, c.charname, ci.itemid, ci.bazaar, COALESCE(ita.name,itb.name,itf.name,itp.name,itw.name) AS itemname FROM char_inventory AS ci
    LEFT JOIN item_equipment AS ita ON ci.itemid = ita.itemid
    LEFT JOIN item_basic AS itb ON ci.itemid = itb.itemid
    LEFT JOIN item_furnishing AS itf ON ci.itemid = itf.itemid
    LEFT JOIN item_puppet AS itp ON ci.itemid = itp.itemid
    LEFT JOIN item_weapon AS itw ON ci.itemid = itw.itemid
    LEFT JOIN chars AS c on c.charid = ci.charid
    WHERE ci.bazaar > 0 AND ci.itemid = ?
    ORDER BY ci.bazaar ASC;`;

const getForSaleBazaar = async (item: Item): Promise<{ error: string | null, data: Item[] | null }> => {
    return cache.get({
        key: `getSaleBazaarData_${item.itemid}`,
        ttl: 500,
    }, async () => {
        try {
            const results: BazaarItem[] = await query(getForSaleBazaarQuery, [item.itemid]);
            if (results.length) {
                return { error: null, data: results };
            }
            return { error: null, data: null };
        } catch (error: any) {
            return { error: `[getForSaleBazaar error]: ${error.message}`, data: null };
        }
    });
}

export default getForSaleBazaar;