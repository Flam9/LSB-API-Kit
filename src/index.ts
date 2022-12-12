import { initDbConnection, closeDbConnection } from './db';
import * as accounts from './api/accounts';
import * as audits from './api/audits';
import * as characters from './api/characters';

const init = async () => {
  initDbConnection();

  // Accounts Tests
  // console.log(await accounts.getAccountInfo('Bob'));
  // console.log(await accounts.getAccountInfo(1004));
  // console.log(await accounts.updateStatus('Testy', 'Active'));
  // console.log(await accounts.deleteSession('Test'));

  // Audit Tests
  // console.log(await audits.getTotalServerGil());
  // console.log(await audits.getTopGilByAccount(5));
  // console.log(await audits.getTopGilByCharacter(2));

  // Character Tests
  // console.log(await characters.getOnlineCharacters(1));
  // console.log(await characters.getUniqueCharacterCount());
  // console.log(await characters.unstuckCharacter('Atest'));

  closeDbConnection(() => {
    console.log('Closed the database connection');
  });
};

init();
