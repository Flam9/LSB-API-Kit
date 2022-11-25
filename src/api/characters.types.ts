export interface OnlineCharacter {
  charname: string;
  nameflags: number;
  pos_zone: number;
  gmlevel: number;
  ls1name: string;
  ls2name: string;
  ls1color: number | string;
  ls2color: number | string;
  ls1rank: number;
  ls2rank: number;
  mjob: number;
  sjob: number;
  mlvl: number;
  slvl: number;
  mentor: number;
  charid: number;
  unlocked: number;
  genkai: number;
  war: number;
  mnk: number;
  whm: number;
  blm: number;
  rdm: number;
  thf: number;
  pld: number;
  drk: number;
  bst: number;
  brd: number;
  rng: number;
  sam: number;
  nin: number;
  drg: number;
  smn: number;
  blu: number;
  cor: number;
  pup: number;
  dnc: number;
  sch: number;
  geo: number;
  run: number;
  zonename: string;
  ishidden: number;
}

export type GetIdsByCharNameReturnValue = { accid: number; charid: number };

export interface UnstuckCharacter {
  accid: number;
  charid: number;
  charname: string;
  pos_zone: number;
  pos_prevzone: number;
  pos_rot: number;
  pos_x: number;
  pos_y: number;
  pos_z: number;
  home_zone: number;
  home_rot: number;
  home_x: number;
  home_y: number;
  home_z: number;
  bans: number;
}
