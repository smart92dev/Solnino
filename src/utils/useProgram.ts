import { createContext, useContext } from 'react';
import { PublicKey } from '@solana/web3.js';

export interface ProgramContextState {
  isGameLoading: boolean;
  isBetLoading: boolean;
  isOpenBetLoading: boolean;
  isLeaderboardLoading: boolean;
  verified: boolean;
  games: any[];
  bets: any[];
  openBets: any[];
  leaderboard: any[];
  getLeaderboard(): void;
  getGames(): void;
  getGame(address: PublicKey): any;
  getBets(): void;
  getOpenBets(): void;
  analysisTokenAmount(currency: any, amount: number): Promise<boolean>;
  createGame(
    category: number,
    team1: string,
    team2: string,
    time: number,
  ): void;
  updateGame(
    game: PublicKey,
    category: number,
    team1: string,
    team2: string,
    time: number,
  ): void;
  resultGame(game: PublicKey, res: number): void;
  createP2PBet(
    game: PublicKey,
    currency: any,
    amount: number,
    sel: number,
    opWallet: PublicKey,
  ): void;
  acceptP2PBet(bet: any): void;
  acceptP2POpenBet(bet: any): void;
  cancelP2PBet(bet: any): void;
  withdrawP2PBet(bet: any): void;
  createHouseBet(
    game: PublicKey,
    currency: any,
    amount: number,
    sel: number,
  ): void;
  withdrawHouseBet(bet: any): void;
  redeem(bet: any): void;
}

export const ProgramContext = createContext<ProgramContextState>({
  isGameLoading: false,
  isBetLoading: false,
  isLeaderboardLoading: false,
} as ProgramContextState);

export function useProgram(): ProgramContextState {
  return useContext(ProgramContext);
}
