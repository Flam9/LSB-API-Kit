import { query } from '../db';
import { hasGmFlag, getLinkshellHtmlColor } from '../utils/characterUtils';

interface OnlineCharacter {
  charname: string;
  nameflags: number;
  pos_zone: number;
  gmlevel: number;
  ls1name: string;
  ls2name: string;
  ls1color: number | string;
  ls2color: number | string;
  ls1rank: number;
  ls2rank: number;
  mjob: number;
  sjob: number;
  mlvl: number;
  slvl: number;
  mentor: number;
  charid: number;
  unlocked: number;
  genkai: number;
  war: number;
  mnk: number;
  whm: number;
  blm: number;
  rdm: number;
  thf: number;
  pld: number;
  drk: number;
  bst: number;
  brd: number;
  rng: number;
  sam: number;
  nin: number;
  drg: number;
  smn: number;
  blu: number;
  cor: number;
  pup: number;
  dnc: number;
  sch: number;
  geo: number;
  run: number;
  zonename: string;
  ishidden: number;
}

/**
 * Gets a list of current online characters.
 *
 * @param {function} done The callback to invoke when the function has completed.
 */
export const getOnlineCharacters = async () => {
  const sql = `SELECT c.charname, cs.nameflags, c.pos_zone, c.gmlevel, ls1.name AS ls1name, ls2.name AS ls2name, ls1.color AS ls1color, ls2.color AS ls2color, s.linkshellrank1 AS ls1rank, s.linkshellrank2 AS ls2rank, cs.mjob, cs.sjob, cs.mlvl, cs.slvl, c.mentor, cj.*, z.name AS zonename,
  (SELECT COUNT(*) FROM char_vars AS cv WHERE cv.charid = c.charid AND cv.varname LIKE '%gmhidden%') AS ishidden
  FROM accounts_sessions AS s
  LEFT JOIN chars AS c ON s.charid = c.charid
  LEFT JOIN linkshells AS ls1 ON s.linkshellid1 = ls1.linkshellid
  LEFT JOIN linkshells AS ls2 ON s.linkshellid2 = ls2.linkshellid
  LEFT JOIN char_stats AS cs ON s.charid = cs.charid
  LEFT JOIN char_jobs AS cj ON s.charid = cj.charid
  LEFT JOIN zone_settings AS z ON c.pos_zone = z.zoneid
  ORDER BY c.gmlevel DESC, c.charname ASC;`;

  // Query the database for the online characters..
  try {
    const rows = await query<OnlineCharacter>(sql);
    const formattedRows = rows
      .filter((row) => {
        return (
          // Skip hidden players
          row.ishidden === 0 ||
          // Skip GMs that are anon (/anon)
          (row.gmlevel > 0 && (row.nameflags & 0x00001000) !== 0x00001000)
        );
      })
      .map((row) => {
        const newRow = { ...row };

        // Hide players GM status if their flag is off..
        if (!hasGmFlag(row.nameflags)) {
          newRow.gmlevel = 0;
        }

        // If GM hide LS info
        if (newRow.gmlevel > 0) {
          newRow.ls1name = '';
          newRow.ls2name = '';
          newRow.ls1color = 0;
          newRow.ls2color = 0;
        } else {
          // If not GM, convert LS colors to RGB values
          newRow.ls1color = getLinkshellHtmlColor(row.ls1color);
          newRow.ls2color = getLinkshellHtmlColor(row.ls2color);
        }

        return newRow;
      })
      .sort((char1: OnlineCharacter, char2: OnlineCharacter) => {
        var nameorder =
          char1.charname === char2.charname ? 0 : char1.charname < char2.charname ? -1 : 1;
        if (
          (char1.gmlevel > 0 && char2.gmlevel > 0) ||
          (char1.gmlevel === 0 && char2.gmlevel === 0)
        ) {
          return nameorder;
        } else if (char1.gmlevel > 0) {
          return -1;
        }
        return 1;
      });

    return formattedRows;
  } catch (error) {
    console.log('[getOnlineCharacters error]: ', error);
  }
};

export const getUniquePlayerCount = async () => {
  const sql = `SELECT COUNT(DISTINCT(client_addr)) AS count FROM accounts_sessions;`;

  // Query the database for the online characters..
  try {
    return await query(sql);
  } catch (error) {
    console.log('[getUniquePlayerCount error]: ', error);
  }
};
