export const getOnlineCharactersQuery = `SELECT c.charname, cs.nameflags, c.pos_zone, c.gmlevel, ls1.name AS ls1name, ls2.name AS ls2name, ls1.color AS ls1color, ls2.color AS ls2color, s.linkshellrank1 AS ls1rank, s.linkshellrank2 AS ls2rank, cs.mjob, cs.sjob, cs.mlvl, cs.slvl, c.mentor, cj.*, z.name AS zonename,
(SELECT COUNT(*) FROM char_vars AS cv WHERE cv.charid = c.charid AND cv.varname LIKE '%gmhidden%') AS ishidden
FROM accounts_sessions AS s
LEFT JOIN chars AS c ON s.charid = c.charid
LEFT JOIN linkshells AS ls1 ON s.linkshellid1 = ls1.linkshellid
LEFT JOIN linkshells AS ls2 ON s.linkshellid2 = ls2.linkshellid
LEFT JOIN char_stats AS cs ON s.charid = cs.charid
LEFT JOIN char_jobs AS cj ON s.charid = cj.charid
LEFT JOIN zone_settings AS z ON c.pos_zone = z.zoneid
ORDER BY c.gmlevel DESC, c.charname ASC;`;

export const getUniquePlayerCountQuery = `SELECT COUNT(DISTINCT(client_addr)) AS count FROM accounts_sessions;`;

export const getIdsByCharNameQuery = `SELECT accid, charid FROM chars WHERE charname = ?`;

export const unstuckCharacterQuery = `SELECT c.accid, c.charid, c.charname, c.home_zone, c.pos_zone, c.pos_prevzone, c.pos_rot, c.pos_x, c.pos_y, c.pos_z, c.home_rot, c.home_x, c.home_y, c.home_z, COUNT(ab.accid) AS bans FROM chars AS c
LEFT JOIN accounts_banned AS ab ON ab.accid = c.accid
WHERE c.accid = ? AND c.charid = ?;`;

export const unstuckCharacterUpdateQuery =
  'UPDATE chars SET pos_zone = ?, pos_prevzone = ?, pos_rot = ?, pos_x = ?, pos_y = ?, pos_z = ? WHERE charid = ?;';
