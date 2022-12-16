import { query } from '../../db';
import { cache } from '../../cache';
import { Item } from './getItem';

const getItemDetailsQueries: string[] = [
	'SELECT itemid, name, level, jobs, shieldsize, scripttype, slot, rslot FROM item_equipment WHERE itemid = ?;',
	'SELECT itemid, name, storage, moghancement, element, aura FROM item_furnishing WHERE itemid = ?;',
	'SELECT itemid, name, slot, element FROM item_puppet WHERE itemid = ?;',
	'SELECT itemid, name, validtargets, activation, animation, animationtime, maxcharges, usedelay, reusedelay, aoe FROM item_usable WHERE itemid = ?;',
	'SELECT itemid, name, skill, subskill, dmgtype, hit, delay, dmg, unlock_points FROM item_weapon WHERE itemid = ?;'
];

const getItemDetail = async (item: Item): Promise<{ error: string | null, data: Item | null }> => {
	return cache.get({
		key: `getItemDetail_${item.itemid}`,
		ttl: 500
    }, async () => {
        try {
            const queryCount: number = getItemDetailsQueries.length;
            var i: number = 0;
            var itemArray: Item[] = [];
            while (i < queryCount) {
                const itemDetail = await execItemQuery(getItemDetailsQueries[i], item);
                if (itemDetail !== null) {
                    itemArray.push(itemDetail);
                }
                i++;
            }
            if (itemArray.length) {
                return { error: null, data: mergeItemData(itemArray) };
            }
            return { error: null, data: item };
        }
        catch (error: any) {
            return { error: `[getItemDetail error]: ${error.message}`, data: null };
        }
	});
}

const execItemQuery = async function(sql: string, item: Item): Promise<Item | null> {
    const results: Item[] = await query(sql, [item.itemid]);
    if (results[0]) {
        const resultItem: Item = { ...item, ...results[0] };
        return resultItem;
    }
    return null;
}

const mergeItemData = function (items: Item[]): Item {
    var count: number = 0;
    var item: Item = items[0];
    while (count < items.length) {
        count++;
        item = { ...item, ...items[count] };
    }
    return item;
}

export default getItemDetail;