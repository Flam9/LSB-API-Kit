import { initDbConnection, closeDbConnection } from './db';
import * as accounts from './api/accounts';
import * as audits from './api/audits';
import * as characters from './api/characters';
import * as bcnms from './api/bcnms';
import * as items from './api/items';
import * as monsters from './api/monsters';

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

  // Item Tests
  // const item = (await items.getItem('grass thread')).data;
  // if (item !== null) {
  //     console.log(await items.getItemDetail(item));
  //     console.log(await items.getDroppedBy(item));
  //     console.log(await items.getForSaleAuction(item));
  //     console.log(await items.getForSaleBazaar(item));
  //     console.log(await items.getItemRecipe(item));
  //     console.log(await items.getRecipesUsingItem(item));
  //     console.log(await items.getSaleHistory(item));
  // }

  // Monster Tests
  // const monster = (await monsters.getMonster(16781323)).data;
  // console.log(await monsters.getMonsterDetail(monster[0]));
  // console.log(await monsters.getMonsterDrops(monster[0]));

  closeDbConnection(() => {
    console.log('Closed the database connection');
  });
};

init();
