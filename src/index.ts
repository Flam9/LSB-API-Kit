import { initDbConnection, closeDbConnection } from './db';
import { getOnlineCharacters, getUniquePlayerCount } from './api/characters';

const init = async () => {
  initDbConnection();

  console.log(await getOnlineCharacters());
  console.log(await getUniquePlayerCount());

  closeDbConnection(() => {
    console.log('Closed the database connection');
  });
};

init();
