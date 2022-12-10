export type TotalGil = { quantity: number };

export interface TotalGilByCharacter {
  charid: number;
  accid: number;
  charname: string;
  quantity: TotalGil;
}

export interface TotalGilByAccount {
  accid: number;
  login: string;
  quantity: TotalGil;
}
