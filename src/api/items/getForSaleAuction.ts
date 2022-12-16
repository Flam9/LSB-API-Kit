import { query } from '../../db';
import { cache } from '../../cache';
import { Item } from './getItem';

export interface AuctionItem {
    itemid: number;
    seller_name: string;
    buyer_name: string;
    sale: number;
    sale_date: number;
    item_name: string;
}

const getForSaleAuctionQuery = `SELECT ah.itemid, ah.seller_name, ah.buyer_name
    COALESCE(ita.name, itb.name, itf.name, itp.name, itw.name) AS itemname FROM auction_house AS ah
    LEFT JOIN item_armor AS ita ON ah.itemid = ita.itemid
    LEFT JOIN item_basic AS itb ON ah.itemid = itb.itemid
    LEFT JOIN item_furnishing AS itf ON ah.itemid = itf.itemid
    LEFT JOIN item_puppet AS itp ON ah.itemid = itp.itemid
    LEFT JOIN item_weapon AS itw ON ah.itemid = itw.itemid
    WHERE ah.itemid = ? AND ah.sell_date = 0`;

const getForSaleAuction = async (item: Item): Promise<{ error: string | null; data: Item[] | null }> => {
    return cache.get({
        key: `getSaleAuctionData_${item.itemid}`,
        ttl: 500,
    }, async () => {
        try {
            const results: AuctionItem[] = await query(getForSaleAuctionQuery, [item.itemid]);
            if (results.length) {
                return { error: null, data: results };
            }
            return { error: null, data: null };
        } catch (error: any) {
            return { error: `[getSaleForSaleAuction error]: ${error.message}`, data: null };
        }
    });
}

export default getForSaleAuction;