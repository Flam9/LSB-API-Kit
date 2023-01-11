import { query } from '../../db';
import { cache } from '../../cache';

export interface Monster {
	mobid: number;
	mobname: string;
	polutils_name: string;
	zonename: string;
	groupid?: number;
	pos_x?: number;
	pos_y?: number;
	pos_z?: number;
	pos_rot?: number;
	poolid?: number;
	zoneid?: number;
	name?: string;
	respawntime?: number;
	spawntype?: number;
	dropid?: number;
	HP?: number;
	MP?: number;
	minLevel?: number;
	maxLevel?: number;
	allegiance?: number;
	mobType?: number;
	familyHP?: number;
	minHP?: number;
	maxHP?: number;
}

const getMonsterByNameQuery: string = `SELECT mobid, mobname, polutils_name, zs.name AS zonename FROM mob_spawn_points AS sp
    INNER JOIN mob_groups AS mg ON sp.groupid = mg.groupid
    INNER JOIN zone_settings AS zs ON mg.zoneid = zs.zoneid
    WHERE mobname LIKE ? ORDER BY mobname ASC;`;
const getMonsterByIdQuery: string = `SELECT mobid, mobname, polutils_name, zs.name AS zonename FROM mob_spawn_points AS sp
    INNER JOIN mob_groups AS mg ON sp.groupid = mg.groupid
    INNER JOIN zone_settings AS zs ON mg.zoneid = zs.zoneid
    WHERE mobid = ? ORDER BY mobname ASC;`;

const getMonster = async (searchTerm: string | number): Promise<{ error: string | null, data: Monster[] | null }> => {
	// If search is by name, transform name for database
	if (typeof searchTerm === 'string') {
		searchTerm = searchTerm.replace(/ /g, '_');
		searchTerm = searchTerm.replace(/'/g, '');
		searchTerm = searchTerm.replace(/"/, '');
	}
	return cache.get({
		key: `getMonster_${searchTerm}`,
		ttl: 500,
	}, async () => {
		// Determine which query to use
		var queryType: string;
		if (typeof searchTerm === 'string') {
			queryType = getMonsterByNameQuery;
		} else {
			queryType = getMonsterByIdQuery;
		}
		//Get basic monster data
		try {
			const results: Monster[] = await query(queryType, [searchTerm]);
			if (results) {
				return { error: null, data: results };
			}
			return { error: null, data: null };
		} catch (error: any) {
			return { error: `[getMonster error]: ${error.message}`, data: null };
		}
	});
}

export default getMonster;