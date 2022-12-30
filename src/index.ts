import { initDbConnection, closeDbConnection } from './db';
import * as accounts from './api/accounts';
import * as audits from './api/audits';
import * as characters from './api/characters';
import * as bcnms from './api/bcnms';

const init = async () => {
  initDbConnection();
  // Accounts Tests
  // console.log(await accounts.getAccountInfo('Bob'));
  // console.log(await accounts.getAccountInfo(1000));
  // console.log(await accounts.updateStatus('Eit', 'Active'));
  // console.log(await accounts.deleteSession('Eit'));
  // console.log(await accounts.getAccountType('Eit','Eit'));

  // Audit Tests
  // console.log(await audits.getTotalServerGil());
  // console.log(await audits.getTopGilByAccount(5));
  // console.log(await audits.getTopGilByCharacter(2));

  // Character Tests
  // console.log(await characters.getIdsByCharacterName('Catd'));
  // console.log(await characters.getOnlineCharacters(1));
  // console.log(await characters.getUniqueCharacterCount());
  // console.log(await characters.unstuckCharacter('Cat'));

  // BCNM Tests
  // console.log(await bcnms.getBcnmInfo());
  // console.log(await bcnms.getBcnmInfo(2));

  closeDbConnection(() => {
    console.log('Closed the database connection');
  });
};

init();
