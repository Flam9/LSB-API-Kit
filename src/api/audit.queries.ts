export const totalServerGilQuery = `
select sum(ci.quantity) as 'quantity'
from char_inventory ci
inner join chars c on c.charid = ci.charid
inner join accounts a on c.accid = a.id
where a.status = 1;
`

export const topTenCharactersByGilQuery = `
select
	c.charid,
	c.accid,
	c.charname,
	ci.quantity
from char_inventory ci
inner join chars c on c.charid = ci.charid
where ci.itemId = 65535
order by ci.quantity desc
limit 10;
`

export const topTenAccountsByGilQuery = `
select
	a.id as 'accId',
	a.login,
	sum(ci.quantity) as 'quantity'
from char_inventory ci
inner join chars c on c.charid = ci.charid
inner join accounts a on c.accid = a.id
where ci.itemId = 65535
group by a.id, a.login
order by ci.quantity desc
limit 10;
`