import { ConfirmOptions, PublicKey, Keypair } from '@solana/web3.js';
import { notification } from 'antd';

import SOL_IMG from '@Assets/images/SOL.svg';
import USDC_IMG from '@Assets/images/USDC.svg';
import USDT_IMG from '@Assets/images/USDT.svg';
import ROGUE_IMG from '@Assets/images/ROGUE.svg';
import BOTC_IMG from '@Assets/images/BOTC.png';
import RUDE_IMG from '@Assets/images/RUDE.png';
import TACOS_IMG from '@Assets/images/TACOS.png';
import SOCCER_IMG from '@Assets/images/Soccer.png';
import FOOTBALL_IMG from '@Assets/images/Football.png';
import UFC_IMG from '@Assets/images/UFC.png';
import HOCKEY_IMG from '@Assets/images/Hockey.png';
import BASKETBALL_IMG from '@Assets/images/Basketball.png';
import CRICKET_IMG from '@Assets/images/Cricket.png';
import BASEBALL_IMG from '@Assets/images/Baseball.png';

export const CURRENCIES = [
  {
    name: 'SOL',
    logo: SOL_IMG,
    decimals: 9,
    mint: new PublicKey('So11111111111111111111111111111111111111112'),
    tokenAccount: new PublicKey('8eQn9QdSWxUyJhZzVRBQuYTa7C1vZ6CDiCpZDY7ZBJi9'),
  },
  {
    name: 'USDC',
    logo: USDC_IMG,
    decimals: 6,
    mint: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
    tokenAccount: new PublicKey('HpmCbo6ykg4yPsSmu19jzhDp91frurd3ZHKCMbGFpw6c'),
  },
  {
    name: 'USDT',
    logo: USDT_IMG,
    decimals: 6,
    mint: new PublicKey('Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'),
    tokenAccount: new PublicKey('AqUXLkGk7FLm1Gzo294xh7STFZyEewewUXKoe7rFd6Pt'),
  },
  {
    name: 'ROGUE',
    logo: ROGUE_IMG,
    decimals: 7,
    mint: new PublicKey('rogue3qZEABqmjpL9orMosdBh2a1rfmpoDKfPrztG1K'),
    tokenAccount: new PublicKey('C2nvuF6sspfNifzf3FD8sbaUJpF9aFeoN5s6xxqyrxap'),
  },
  {
    name: 'BOTC',
    logo: BOTC_IMG,
    decimals: 7,
    mint: new PublicKey('botcSYmVPr3KvyJurMMxDqRfxszjKpKvGJJwjNhXm2x'),
    tokenAccount: new PublicKey('CVfxPtYobVC9FnpmGY2o3PVqKwYtHNssXGLJ65Y4hhx'),
  },
  {
    name: 'RUDE',
    logo: RUDE_IMG,
    decimals: 9,
    mint: new PublicKey('RUDEx2bKtRsZmxXS5cGNVLXbX4u5ECynCbTjfNuRbsZ'),
    tokenAccount: new PublicKey('D8RKmVLo7guW9tpUcjhazv7FmuFg3RURYy9dSsJ4Wwaa'),
  },
  {
    name: 'TACOS',
    logo: TACOS_IMG,
    decimals: 4,
    mint: new PublicKey('3yjCHAThuRTU8vFctU51ept4esSra5aneN9ZqZmQwjWr'),
    tokenAccount: new PublicKey('3tAK2t4F8q4hkSqqQgUaSWx4aPR5FWBJBP8AzGk33H9q'),
  },
];
export const P2P_CURRENCIES = [0, 1, 2, 3, 4, 5, 6];
export const HOUSE_CURRENCIES = [3, 4, 5, 6];

export const CATEGORIES = [
  { name: 'Soccer', logo: SOCCER_IMG },
  { name: 'Football', logo: FOOTBALL_IMG },
  { name: 'UFC', logo: UFC_IMG },
  { name: 'Hockey', logo: HOCKEY_IMG },
  { name: 'Basketball', logo: BASKETBALL_IMG },
  { name: 'Cricket', logo: CRICKET_IMG },
  { name: 'Baseball', logo: BASEBALL_IMG },
];

export const LEADERBOARD_EXAMPLE = [
  {
    wallet: 'BhGf158WRCfJHA4BbF5QUycnaKeBogWeR52yESSb5Qmf',
    win: 107,
    loss: 12,
    ties: 3,
    totalWagered: 1420,
  },
  {
    wallet: '1aY7BjKxva4YWGxGh1NvnL1HvryKLzB14N1haU3w9nW',
    win: 98,
    loss: 17,
    ties: 0,
    totalWagered: 1000,
  },
];

export const POOL_DATA = {
  address: new PublicKey('FV1ZA7h1pac9h8tHyQQ7fMwmGSpWoFmWaRzGsir3Y4Yk'),
  feeData: [new PublicKey('EKosGh7h4XEa6o1hZMF1wpfvkAjg5k5nSpB3Gn1ujfYw')],
  owners: [
    new PublicKey('C1ResCfLjchCut1seuTvEZa1QMsDpdTZW26A9NRQjBwc'),
    new PublicKey('EKosGh7h4XEa6o1hZMF1wpfvkAjg5k5nSpB3Gn1ujfYw'),
    new PublicKey('HWNcTGcX6NS9WHB2X7GqPMkWqwaUcR2r3fbzXiswEw7M'),
    new PublicKey('G4s6JWLtvEfbybMWrQgmgQYtERfmvFy3UiWa9SjKJgwV'),
  ],
};
export const idl = require('./betting.json');
export const programId = new PublicKey(
  '98pSexKL2SW664GiLLvtrutwaUHmsWVscqcR474rz3vy',
);
export const confirmOption: ConfirmOptions = {
  commitment: 'finalized',
  preflightCommitment: 'finalized',
  skipPreflight: false,
};

export const openNotification = (
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  description?: string,
) => {
  notification[type]({
    message: title,
    description: description,
    placement: 'topLeft',
  });
};

// export const mints=require('./sortMints.json')

export const MediaIds = [
  '1588315714095554560',
  '1588316063007137792',
  '1588316469103890433',
  '1588316586166947840',
  '1588316700595945472',
  '1588316820435525632',
  '1588316910189510657',
  '1588317015701348352',
  '1588317154578923520',
  '1588317309680193545',
];
