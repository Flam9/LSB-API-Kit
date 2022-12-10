export const banPlayerByAccIdQuery = `
update accounts
set status = 2, timelastmodify = now()
where status = 1 and id = ?;
`;

export const unbanPlayerByAccIdQuery = `
update accounts
set status = 1, timelastmodify = now()
where status = 2 and id = ?;
`;

export const getAccIdByUserNameQuery = `
select id as accId from accounts where login = ?;
`;

export const deleteSessionByAccIdQuery = `
delete from accounts_sessions where accid = ?;
`;
