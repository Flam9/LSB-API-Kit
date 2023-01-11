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

const getItemRecipeQuery: string = 'SELECT * FROM synth_recipes WHERE Result = ? OR ResultHQ1 = ? or ResultHQ2 = ? OR ResultHQ3 = ?;';

const getItemRecipe = async (item: Item): Promise<{ error: string | null, data: Recipe[] | null }> => {
    return cache.get({
        key: `getItemRecipe_${item.itemid}`,
        ttl: 500,
    }, async () => {
        try {
            const results: Recipe[] = await query(getItemRecipeQuery, [item.itemid, item.itemid, item.itemid, item.itemid]);
            if (results[0]) {
                return { error: null, data: results };
            }
            return { error: null, data: null };
        } catch (error: any) {
            return { error: `[getItemRecipe error]: ${error.message}`, data: null }
        }
    });
}

export default getItemRecipe;