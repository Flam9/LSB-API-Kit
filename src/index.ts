import { initDbConnection, closeDbConnection } from './db';
import {
  getOnlineCharacters,
  getUniquePlayerCount,
  getIdsByCharName,
  unstuckCharacter,
} from './api/characters';

const init = async () => {
  initDbConnection();

  console.log(await getOnlineCharacters());
  console.log(await getUniquePlayerCount());
  console.log(await getIdsByCharName('Flam'));
  console.log(await getIdsByCharName('Flammm'));
  console.log(await unstuckCharacter('Flam'));
  console.log(await unstuckCharacter('Flffam'));

  closeDbConnection(() => {
    console.log('Closed the database connection');
  });
};

init();
