import { query } from '../../db';
import { cache } from '../../cache';
import { Monster } from './getMonster';

const getMonsterDetailsQuery: string = `SELECT sp.mobid, sp.mobname, sp.polutils_name, sp.pos_x, sp.pos_y, sp.pos_z, sp.pos_rot,
    mg.groupid, mg.poolid, mg.name, mg.respawntime, mg.spawntype, mg.dropid, mg.HP, mg.MP, mg.minLevel, mg.maxLevel, mg.allegiance, 
    mfs.HP as familyHP, mp.mobType, zs.zoneid AS zoneid, zs.name AS zonename FROM mob_spawn_points AS sp
    INNER JOIN mob_groups AS mg ON sp.groupid = mg.groupid
    INNER JOIN zone_settings AS zs ON mg.zoneid = zs.zoneid
    INNER JOIN mob_pools AS mp ON mp.poolid = mg.poolid
    INNER JOIN mob_family_system AS mfs ON mfs.familyid = mp.familyid
    WHERE mobid = ? LIMIT 1;`;


const getMonsterDetail = async (monster: Monster): Promise<{ error: string | null, data: Monster | null }> => {
    return cache.get({
        key: `getMonsterDetail_${monster.mobid}`,
        ttl: 500
    }, async () => {
        try {
            const monsterDetail = await query(getMonsterDetailsQuery, [monster.mobid]);
            if (monsterDetail[0]) {
                const mob = monsterDetail[0];
                monster.minHP = getMonsterHealth(mob.minLevel, mob.HP, mob.familyHP, mob.mobType, 0);
                monster.maxHP = getMonsterHealth(mob.maxLevel, mob.HP, mob.familyHP, mob.mobType, 0);
                return { error: null, data: { ...mob, ...monster } };
            }   
            return { error: null, data: monster };
        }
        catch (error: any) {
            return { error: `[getMonsterDetail error]: ${error.message}`, data: null };
        }
    });
}

const getMonsterHealth = function (lvl: number, hp: number, familyhp: number, isNM: string, scaleModAmount: number) {
    var maxhp = 0;

    var map_config_nm_multiplier = 1.1;
    var map_config_mob_multiplier = 1.0;

    // If the monster has no health, calculate it..
    if (hp == 0) {
        var base = 18.0;
        var growth = 1.06;
        var scale = familyhp / 100.0;

        // TODO: Handle the scaleModAmount here!
        // hpScale = getMobMod(MOBMOD_HP_SCALE) / 100.0f

        if (lvl > 75)
            growth = 1.28;
        else if (lvl > 65)
            growth = 1.27;
        else if (lvl > 55)
            growth = 1.25;
        else if (lvl > 50)
            growth = 1.21;
        else if (lvl > 45)
            growth = 1.17;
        else if (lvl > 35)
            growth = 1.14;
        else if (lvl > 25)
            growth = 1.1;

        maxhp = Math.floor(base * Math.pow(lvl, growth) * scale);

        if (isNM) {
            maxhp *= 2.0;
            if (lvl > 75)
                maxhp *= 2.5;
        }
    } else {
        maxhp = hp;
    }

    if (isNM)
        maxhp *= map_config_nm_multiplier;
    else
        maxhp *= map_config_mob_multiplier;

    return Math.floor(maxhp);
}

export default getMonsterDetail;