import { query } from '../../db';
import { cache } from '../../cache';
import { Item } from './getItem';

const itemTables = ['item_armor', 'item_basic', 'item_furnishing', 'item_usable', 'item_weapon'];

const execItemsQuery = async function (sql: string): Promise<Item[] | null> {
    const results: Item[] = await query(sql);
    if (results[0]) {
        return results;
    }
    return null;
}

const getAllItems = async (): Promise<{ error: string | null, data: Item[] | null }> => {
    return cache.get({
        key: 'getAllItems',
        ttl: 500,
    }, async () => {
        try {
            const tableCount: number = itemTables.length;
            var itemArray: Item[] = [];
            var i: number = 0;
            while (i < tableCount) {
                const items = await execItemsQuery(`SELECT itemid, name FROM ${i};`);
                if (items) {
                    items.forEach(function (data: Item) {
                        itemArray[data.itemid] = data;
                    });
                }
                i++;
            }
            return { error: null, data: itemArray }
        } catch (error: any) {
            return { error: `[getAllItems error]: ${error.message}`, data: null }
        }
    });
}

export default getAllItems;