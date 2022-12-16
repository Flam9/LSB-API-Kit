import { query } from '../../db';
import { cache } from '../../cache';

export interface Item {
	itemid: number;
	subid?: number;
	name: string;
	sortname?: string;
	stackSize?: number;
	flags?: number;
	aH?: number;
	NoSale?: number;
	BaseSell?: number;
	level?: number;
	jobs?: number;
	shieldsize?: number;
	scripttype?: number;
	slot?: number;
	rslot?: number;
	storage?: number;
	moghancement?: number;
	element?: number;
	aura?: number;
	validtargets?: number;
	activation?: number;
	animation?: number;
	animationTime?: number;
	maxCharges?: number;
	useDelay?: number;
	reuseDelay?: number;
	aoe?: number;
	skill?: number;
	subskill?: number;
	dmgType?: number;
	hit?: number;
	delay?: number;
	dmg?: number;
	unlock_points?: number;
}

const getItemByNameQuery: string = 'SELECT itemid, subid, name, sortname, stackSize, flags, aH, NoSale, BaseSell FROM item_basic WHERE name = ?';
const getItemBySortNameQuery: string = 'SELECT itemid, subid, name, sortname, stackSize, flags, aH, NoSale, BaseSell FROM item_basic WHERE sortname = ?';
const getItemByIdQuery: string = 'SELECT itemid, subid, name, sortname, stackSize, flags, aH, NoSale, BaseSell FROM item_basic WHERE itemid = ?;';

const getItem = async (searchTerm: string | number): Promise<{ error: string | null, data: Item | null }> => {
	// If search is by name, transform name for database
	if (typeof searchTerm === 'string') {
		searchTerm = searchTerm.replace(/ /g, '_');
		searchTerm = searchTerm.replace(/'/g, '');
		searchTerm = searchTerm.replace(/"/, '');
	}
	return cache.get({
		key: `getItem_${searchTerm}`,
		ttl: 500,
	}, async () => {
		// Determine which query to use
		var queryType: string;
		if (typeof searchTerm === 'string') {
			if (searchTerm.indexOf('.')) {
				queryType = getItemBySortNameQuery;
			} else {
				queryType = getItemByNameQuery;
			}
		} else {
			queryType = getItemByIdQuery;
		}
		//Get basic item data
		try {
			const results: Item[] = await query(queryType, [searchTerm]);
			if (results[0]) {
				return { error: null, data: results[0] };
			}
			return { error: null, data: null };
		} catch (error: any) {
			return { error: `[getItem error]: ${error.message}`, data: null };
		}
	});
}

export default getItem;