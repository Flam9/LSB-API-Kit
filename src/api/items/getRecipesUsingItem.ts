import { query } from '../../db';
import { cache } from '../../cache';
import { Item } from './getItem';

export interface Recipe {
    ID: number;
    Desynth: number;
    KeyItem: number;
    Wood: number;
    Smith: number;
    Gold: number;
    Cloth: number;
    Leather: number;
    Bone: number;
    Alchemy: number;
    Cook: number;
    Crystal: number;
    HQCrystal: number;
    Ingredient1: number;
    Ingredient2: number;
    Ingredient3: number;
    Ingredient4: number;
    Ingredient5: number;
    Ingredient6: number;
    Ingredient7: number;
    Ingredient8: number;
    Result: number;
    ResultHQ1: number;
    ResultHQ2: number;
    ResultHQ3: number;
    ResultQty: number;
    ResultHQ1Qty: number;
    ResultHQ2Qty: number;
    ResultHQ3Qty: number;
    ResultName: number;
}

const getRecipesUsingItemQuery: string = 'SELECT * FROM synth_recipes WHERE Crystal = ? OR HQCrystal = ? or Ingredient1 = ? OR Ingredient2 = ? OR Ingredient3 = ? OR Ingredient4 = ? OR Ingredient5 = ? OR Ingredient6 = ? OR Ingredient7 = ? OR Ingredient8 = ?;';

const getRecipesUsingItem = async (item: Item): Promise<{ error: string | null, data: Recipe[] | null }> => {
    return cache.get({
        key: `getRecipesUsingItem_${item.itemid}`,
        ttl: 500,
    }, async () => {
        try {
            const results: Recipe[] = await query(getRecipesUsingItemQuery, [item.itemid, item.itemid, item.itemid, item.itemid, item.itemid, item.itemid, item.itemid, item.itemid, item.itemid, item.itemid]);
            if (results[0]) {
                return { error: null, data: results };
            }
            return { error: null, data: null };
        } catch (error: any) {
            return { error: `[getRecipesUsingItem error]: ${error.message}`, data: null }
        }
    });
}

export default getRecipesUsingItem;