import { initDbConnection, closeDbConnection } from './db';
import {
  getOnlineCharacters,
  getUniquePlayerCount,
  getIdsByCharName,
  unstuckCharacter,
} from './api/characters';

import {
  getAccountIdByUserName,
  banPlayerByAccId,
  unbanPlayerByAccId,
  killPlayerSession,
} from './api/account';

import { getTotalServerGil, getTopTenAccountsByGil, getTopTenCharactersByGil } from './api/audit';

const init = async () => {
  initDbConnection();

  // console.log(await getOnlineCharacters());
  // console.log(await getUniquePlayerCount());
  // console.log(await getIdsByCharName('Flam'));
  // console.log(await getIdsByCharName('Flammm'));
  // console.log(await unstuckCharacter('Flam'));
  // console.log(await unstuckCharacter('Flffam'));
  // console.log(await getAccountIdByUserName('Bob'))
  // console.log(await banPlayerByAccId('Bob'))
  // console.log(await unbanPlayerByAccId('Bob'));
  // console.log(await killPlayerSession('Bob'));
  // console.log(await getTotalServerGil());
  console.log(await getTopTenAccountsByGil());
  console.log(await getTopTenCharactersByGil());

  closeDbConnection(() => {
    console.log('Closed the database connection');
  });
};

init();
