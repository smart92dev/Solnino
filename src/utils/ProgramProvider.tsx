import {
  FC,
  useCallback,
  useMemo,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import axios from 'axios';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  AccountLayout,
  NATIVE_MINT,
  getAssociatedTokenAddressSync,
  createCloseAccountInstruction,
  createAssociatedTokenAccountInstruction,
  createInitializeAccountInstruction,
} from '@solana/spl-token';

import { ProgramContext } from './useProgram';
import { sendTransactions, sendTransactionWithRetry } from './utility';
import {
  programId,
  idl,
  confirmOption,
  POOL_DATA,
  CURRENCIES,
  openNotification,
} from './constant';

export interface ProgramProviderProps {
  children: ReactNode;
}

export const ProgramProvider: FC<ProgramProviderProps> = ({ children }) => {
  const wallet = useWallet();
  const SERVER = 'https://solnino.io/manage/';
  const { publicKey } = useWallet();
  const { connection: conn } = useConnection();

  const [games, setGames] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [openBets, setOpenBets] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  const [isGameLoading, setIsGameLoading] = useState(false);
  const [isBetLoading, setIsBetLoading] = useState(false);
  const [isOpenBetLoading, setIsOpenBetLoading] = useState(false);
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);

  const [verified, setVerified] = useState(false);

  const [program] = useMemo(() => {
    const provider = new anchor.AnchorProvider(
      conn,
      wallet as any,
      confirmOption,
    );
    const program = new anchor.Program(idl, programId, provider);
    return [program];
  }, [conn, wallet]);

  useEffect(() => {
    getVerifiedStatus();
  }, [publicKey]);

  const getVerifiedStatus = async () => {
    if (publicKey == null) {
      setVerified(false);
      return false;
    }
    // const tokenAccounts = await conn.getParsedTokenAccountsByOwner(publicKey, {programId: TOKEN_PROGRAM_ID});
    // for(let item of tokenAccounts.value){
    //     const tokenMint = item.account.data.parsed.info.mint
    //     const tokenAmount = item.account.data.parsed.info.tokenAmount
    //     if(tokenAmount.amount==='1' && tokenAmount.decimals===0){
    //         if(mints.find(function(mint : any){return mint===tokenMint})!==undefined){
    //             setVerified(true);
    //             return true;
    //         }
    //     }
    // }
    setVerified(false);
    return false;
  };

  const getLeaderboard = async () => {
    setIsLeaderboardLoading(true);
    const allLeader: any[] = [];
    const LEADER_SIZE = 8 + 32 + 32 + 4 + 10 * 64;
    let resp = await conn.getProgramAccounts(programId, {
      commitment: 'max',
      dataSlice: { length: 0, offset: 0 },
      filters: [
        { dataSize: LEADER_SIZE },
        { memcmp: { bytes: POOL_DATA.address.toBase58(), offset: 8 } },
      ],
    });
    for (let item of resp) {
      try {
        let leader = (await program.account.leaderboard.fetch(
          item.pubkey,
        )) as any;
        allLeader.push({ ...leader, wallet: leader.wallet.toBase58() });
      } catch (err) {}
    }
    setLeaderboard(allLeader);
    setIsLeaderboardLoading(false);
  };

  const getGames = async () => {
    setIsGameLoading(true);
    // let prevGames = await axios.get(SERVER+"games")
    const allGames: any[] = [];
    const GAME_SIZE = 8 + 32 + 32 + 1 + 1 + 4 + 30 + 4 + 30 + 8 + 2;
    let resp = await conn.getProgramAccounts(programId, {
      commitment: 'max',
      dataSlice: { length: 0, offset: 0 },
      filters: [
        { dataSize: GAME_SIZE },
        { memcmp: { bytes: POOL_DATA.address.toBase58(), offset: 8 } },
      ],
    });
    for (let item of resp) {
      // let one = (prevGames.data.games as any[]).find(function(game){return game.address===item.pubkey.toBase58()})
      // if(one!==undefined && one.status!==0){
      //     allGames.push({...one, address: item.pubkey})
      // }else{
      try {
        let game = (await program.account.game.fetch(item.pubkey)) as any;
        allGames.push({
          ...game,
          time: game.time.toNumber(),
          address: item.pubkey,
        });
      } catch (err) {}
      // }
    }
    allGames.sort(function (a: any, b: any) {
      if (a.time > b.time) {
        return -1;
      }
      if (a.time < b.time) {
        return 1;
      }
      return 0;
    });
    setGames(allGames);
    setIsGameLoading(false);
  };

  const getGame = async (address: PublicKey) => {
    let game = await program.account.game.fetch(address);
    return game;
  };

  const getBets = async () => {
    setIsBetLoading(true);
    if (publicKey == null) {
      setBets([]);
      return;
    }
    const allBets: any[] = [];
    const BET_SIZE = 8 + 32 + 1 + 1 + 32 + 32 + 32 + 32 + 32 + 8 + 1 + 1 + 1;
    let resp1 = await conn.getProgramAccounts(programId, {
      commitment: 'max',
      dataSlice: { length: 0, offset: 0 },
      filters: [
        { dataSize: BET_SIZE },
        { memcmp: { bytes: POOL_DATA.address.toBase58(), offset: 8 } },
        { memcmp: { bytes: publicKey.toBase58(), offset: 74 } },
      ],
    });
    let resp2 = await conn.getProgramAccounts(programId, {
      commitment: 'max',
      dataSlice: { length: 0, offset: 0 },
      filters: [
        { dataSize: BET_SIZE },
        { memcmp: { bytes: POOL_DATA.address.toBase58(), offset: 8 } },
        { memcmp: { bytes: publicKey.toBase58(), offset: 106 } },
      ],
    });
    const resp = resp1.concat(resp2);
    for (let item of resp) {
      try {
        let bet = (await program.account.bet.fetch(item.pubkey)) as any;
        let currency = CURRENCIES[0];
        for (let item of CURRENCIES) {
          if (item.mint.toBase58() === bet.mint.toBase58()) {
            currency = item;
            break;
          }
        }
        let gameData: any = null;
        for (let game of games) {
          if (game.address.toBase58() === bet.game.toBase58()) {
            gameData = game;
            break;
          }
        }
        if (gameData === null) {
          let res = (await program.account.game.fetch(bet.game)) as any;
          gameData = { ...res, time: res.time.toNumber(), address: bet.game };
        }
        allBets.push({
          ...bet,
          address: item.pubkey,
          amount: bet.amount.toNumber(),
          gameData: gameData,
          currency: currency,
        });
      } catch (err) {}
    }
    allBets.sort(function (a: any, b: any) {
      if (a.gameData.time > b.gameData.time) {
        return -1;
      }
      if (a.gameData.time < b.gameData.time) {
        return 1;
      }
      return 0;
    });
    setBets(allBets);
    setIsBetLoading(false);
  };

  const getOpenBets = async () => {
    setIsOpenBetLoading(true);
    const allBets: any[] = [];
    const BET_SIZE = 8 + 32 + 1 + 1 + 32 + 32 + 32 + 32 + 32 + 8 + 1 + 1 + 1;
    let resp = await conn.getProgramAccounts(programId, {
      commitment: 'max',
      dataSlice: { length: 0, offset: 0 },
      filters: [
        { dataSize: BET_SIZE },
        { memcmp: { bytes: POOL_DATA.address.toBase58(), offset: 8 } },
        { memcmp: { bytes: POOL_DATA.address.toBase58(), offset: 106 } },
      ],
    });
    for (let item of resp) {
      try {
        let bet = (await program.account.bet.fetch(item.pubkey)) as any;
        let currency = CURRENCIES[0];
        for (let item of CURRENCIES) {
          if (item.mint.toBase58() === bet.mint.toBase58()) {
            currency = item;
            break;
          }
        }
        let gameData: any = null;
        for (let game of games) {
          if (game.address.toBase58() === bet.game.toBase58()) {
            gameData = game;
            break;
          }
        }
        if (gameData === null) {
          let res = (await program.account.game.fetch(bet.game)) as any;
          gameData = { ...res, time: res.time.toNumber(), address: bet.game };
        }
        allBets.push({
          ...bet,
          address: item.pubkey,
          amount: bet.amount.toNumber(),
          gameData: gameData,
          currency: currency,
        });
      } catch (err) {}
    }
    allBets.sort(function (a: any, b: any) {
      if (a.gameData.time > b.gameData.time) {
        return 1;
      }
      if (a.gameData.time < b.gameData.time) {
        return -1;
      }
      return 0;
    });
    setOpenBets(allBets);
    setIsOpenBetLoading(false);
  };

  const analysisTokenAmount = useCallback(
    async (currency: any, amount: number) => {
      try {
        let walletAmount = 0;
        let address = publicKey!;
        if (currency.name === 'SOL') {
          walletAmount = await conn.getBalance(address);
        } else {
          const tokenAccount = getAssociatedTokenAddressSync(
            currency.mint,
            address,
          );
          let resp: any = (await conn.getTokenAccountBalance(tokenAccount))
            .value;
          walletAmount = Number(resp.amount);
        }
        if (walletAmount > amount * 10 ** currency.decimals) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    },
    [publicKey, conn],
  );

  const createGame = useCallback(
    async (category: number, team1: string, team2: string, time: number) => {
      let address = publicKey!;
      let ins: TransactionInstruction[] = [];
      let game = Keypair.generate();
      ins.push(
        program.instruction.createGame(
          new anchor.BN(category),
          team1,
          team2,
          new anchor.BN(time),
          {
            accounts: {
              creator: address,
              pool: POOL_DATA.address,
              game: game.publicKey,
              systemProgram: SystemProgram.programId,
            },
          },
        ),
      );
      await sendTransactionWithRetry(conn, wallet, ins, [game]);
    },
    [publicKey, wallet, conn, program],
  );

  const updateGame = useCallback(
    async (
      game: PublicKey,
      category: number,
      team1: string,
      team2: string,
      time: number,
    ) => {
      let address = publicKey!;
      let ins: TransactionInstruction[] = [];
      ins.push(
        program.instruction.updateGame(
          new anchor.BN(category),
          team1,
          team2,
          new anchor.BN(time),
          {
            accounts: {
              creator: address,
              pool: POOL_DATA.address,
              game: game,
            },
          },
        ),
      );
      await sendTransactionWithRetry(conn, wallet, ins, []);
    },
    [publicKey, wallet, conn, program],
  );

  const resultGame = useCallback(
    async (game: PublicKey, res: number) => {
      let address = publicKey!;
      let ins: TransactionInstruction[] = [];
      ins.push(
        program.instruction.resultGame(new anchor.BN(res), {
          accounts: {
            creator: address,
            pool: POOL_DATA.address,
            game: game,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
        }),
      );
      await sendTransactionWithRetry(conn, wallet, ins, []);
    },
    [publicKey, wallet, conn, program],
  );

  const createP2PBet = useCallback(
    async (
      game: PublicKey,
      currency: any,
      amount: number,
      sel: number,
      opWallet: PublicKey,
    ) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let betAmount = amount * 10 ** currency.decimals;
      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      if ((await conn.getAccountInfo(leaderboard)) == null) {
        ins.push(
          program.instruction.createLeaderboard({
            accounts: {
              owner: address,
              pool: POOL_DATA.address,
              leaderboard: leaderboard,
              systemProgram: SystemProgram.programId,
            },
          }),
        );
      }
      const bet = Keypair.generate();
      let walletTokenAccount = getAssociatedTokenAddressSync(
        currency.mint,
        address,
      );
      if (currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: betAmount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      }
      let treasuryWallets: any[] = [];
      for (let item of POOL_DATA.feeData) {
        treasuryWallets.push({
          pubkey: item,
          isSigner: false,
          isWritable: true,
        });
      }
      const isVerified = await getVerifiedStatus();
      ins.push(
        program.instruction.createP2PBet(
          new anchor.BN(betAmount),
          new anchor.BN(sel),
          opWallet,
          isVerified,
          {
            accounts: {
              wallet: address,
              leaderboard: leaderboard,
              pool: POOL_DATA.address,
              game: game,
              bet: bet.publicKey,
              mint: currency.mint,
              walletTokenAccount: walletTokenAccount,
              poolTokenAccount: currency.tokenAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              clock: SYSVAR_CLOCK_PUBKEY,
            },
            remainingAccounts: treasuryWallets,
          },
        ),
      );
      if (currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }
      instructions.push(ins);
      signers.push([bet]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const acceptP2PBet = useCallback(
    async (bet: any) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      if ((await conn.getAccountInfo(leaderboard)) == null) {
        ins.push(
          program.instruction.createLeaderboard({
            accounts: {
              owner: address,
              pool: POOL_DATA.address,
              leaderboard: leaderboard,
              systemProgram: SystemProgram.programId,
            },
          }),
        );
      }
      let walletTokenAccount = getAssociatedTokenAddressSync(bet.mint, address);
      if (bet.currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: bet.amount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      }
      let treasuryWallets: any[] = [];
      for (let item of POOL_DATA.feeData) {
        treasuryWallets.push({
          pubkey: item,
          isSigner: false,
          isWritable: true,
        });
      }
      const isVerified = await getVerifiedStatus();
      ins.push(
        program.instruction.acceptP2PBet(isVerified, {
          accounts: {
            wallet: address,
            leaderboard: leaderboard,
            pool: POOL_DATA.address,
            game: bet.game,
            bet: bet.address,
            walletTokenAccount: walletTokenAccount,
            poolTokenAccount: bet.currency.tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
          remainingAccounts: treasuryWallets,
        }),
      );
      if (bet.currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }
      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const acceptP2POpenBet = useCallback(
    async (bet: any) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      if ((await conn.getAccountInfo(leaderboard)) == null) {
        ins.push(
          program.instruction.createLeaderboard({
            accounts: {
              owner: address,
              pool: POOL_DATA.address,
              leaderboard: leaderboard,
              systemProgram: SystemProgram.programId,
            },
          }),
        );
      }
      let walletTokenAccount = getAssociatedTokenAddressSync(bet.mint, address);
      if (bet.currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: bet.amount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      }
      let treasuryWallets: any[] = [];
      for (let item of POOL_DATA.feeData) {
        treasuryWallets.push({
          pubkey: item,
          isSigner: false,
          isWritable: true,
        });
      }
      const isVerified = await getVerifiedStatus();
      ins.push(
        program.instruction.acceptP2POpenBet(isVerified, {
          accounts: {
            wallet: address,
            leaderboard: leaderboard,
            pool: POOL_DATA.address,
            game: bet.game,
            bet: bet.address,
            walletTokenAccount: walletTokenAccount,
            poolTokenAccount: bet.currency.tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
          remainingAccounts: treasuryWallets,
        }),
      );
      if (bet.currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }
      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const withdrawP2PBet = useCallback(
    async (bet: any) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      let [leaderboard2] = await PublicKey.findProgramAddress(
        [
          POOL_DATA.address.toBuffer(),
          (address.toBase58() === bet.wallet1.toBase58()
            ? bet.wallet2
            : bet.wallet1
          ).toBuffer(),
        ],
        programId,
      );
      let walletTokenAccount = getAssociatedTokenAddressSync(bet.mint, address);
      if (bet.currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: bet.amount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      } else {
        if ((await conn.getAccountInfo(walletTokenAccount)) == null) {
          ins.push(
            createAssociatedTokenAccountInstruction(
              address,
              walletTokenAccount,
              address,
              bet.mint,
            ),
          );
        }
      }
      ins.push(
        program.instruction.withdrawP2PBet({
          accounts: {
            wallet: address,
            leaderboard: leaderboard,
            leaderboard2: leaderboard2,
            pool: POOL_DATA.address,
            game: bet.game,
            bet: bet.address,
            walletTokenAccount: walletTokenAccount,
            poolTokenAccount: bet.currency.tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          },
        }),
      );
      if (bet.currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }

      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const cancelP2PBet = useCallback(
    async (bet: any) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      let walletTokenAccount = getAssociatedTokenAddressSync(bet.mint, address);
      if (bet.currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: bet.amount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      } else {
        if ((await conn.getAccountInfo(walletTokenAccount)) == null) {
          ins.push(
            createAssociatedTokenAccountInstruction(
              address,
              walletTokenAccount,
              address,
              bet.mint,
            ),
          );
        }
      }
      ins.push(
        program.instruction.cancelP2PBet({
          accounts: {
            wallet: address,
            leaderboard: leaderboard,
            pool: POOL_DATA.address,
            game: bet.game,
            bet: bet.address,
            walletTokenAccount: walletTokenAccount,
            poolTokenAccount: bet.currency.tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
        }),
      );
      if (bet.currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }

      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const createHouseBet = useCallback(
    async (game: PublicKey, currency: any, amount: number, sel: number) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let betAmount = amount * 10 ** currency.decimals;
      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      if ((await conn.getAccountInfo(leaderboard)) == null) {
        ins.push(
          program.instruction.createLeaderboard({
            accounts: {
              owner: address,
              pool: POOL_DATA.address,
              leaderboard: leaderboard,
              systemProgram: SystemProgram.programId,
            },
          }),
        );
      }
      // const bet = Keypair.generate()
      const [bet] = await PublicKey.findProgramAddress(
        [
          address.toBuffer(),
          game.toBuffer(),
          POOL_DATA.address.toBuffer(),
          currency.mint.toBuffer(),
        ],
        programId,
      );
      if ((await conn.getAccountInfo(bet)) != null) {
        openNotification(
          'warning',
          `You have already played the house bet with ${currency.name} for that game`,
        );
        throw new Error('You can bet only once a game, Please try again');
      }
      let walletTokenAccount = getAssociatedTokenAddressSync(
        currency.mint,
        address,
      );
      if (currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: betAmount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      }
      let treasuryWallets: any[] = [];
      for (let item of POOL_DATA.feeData) {
        treasuryWallets.push({
          pubkey: item,
          isSigner: false,
          isWritable: true,
        });
      }
      const isVerified = await getVerifiedStatus();
      ins.push(
        program.instruction.createHouseBet(
          new anchor.BN(betAmount),
          new anchor.BN(sel),
          isVerified,
          {
            accounts: {
              wallet: address,
              leaderboard: leaderboard,
              pool: POOL_DATA.address,
              game: game,
              bet: bet,
              mint: currency.mint,
              walletTokenAccount: walletTokenAccount,
              poolTokenAccount: currency.tokenAccount,
              tokenProgram: TOKEN_PROGRAM_ID,
              systemProgram: SystemProgram.programId,
              clock: SYSVAR_CLOCK_PUBKEY,
            },
            remainingAccounts: treasuryWallets,
          },
        ),
      );
      if (currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }
      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const withdrawHouseBet = useCallback(
    async (bet: any) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let ins: TransactionInstruction[] = [];
      let [leaderboard] = await PublicKey.findProgramAddress(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      let walletTokenAccount = getAssociatedTokenAddressSync(bet.mint, address);
      if (bet.currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: bet.amount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      } else {
        if ((await conn.getAccountInfo(walletTokenAccount)) == null) {
          ins.push(
            createAssociatedTokenAccountInstruction(
              address,
              walletTokenAccount,
              address,
              bet.mint,
            ),
          );
        }
      }
      ins.push(
        program.instruction.withdrawHouseBet({
          accounts: {
            wallet: address,
            leaderboard: leaderboard,
            pool: POOL_DATA.address,
            game: bet.game,
            bet: bet.address,
            walletTokenAccount: walletTokenAccount,
            poolTokenAccount: bet.currency.tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: SystemProgram.programId,
          },
        }),
      );
      if (bet.currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }

      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  const redeem = useCallback(
    async (bet: any) => {
      let address = publicKey!;
      let instructions: TransactionInstruction[][] = [];
      let signers: Keypair[][] = [];

      let ins: TransactionInstruction[] = [];
      let [leaderboard] = PublicKey.findProgramAddressSync(
        [POOL_DATA.address.toBuffer(), address.toBuffer()],
        programId,
      );
      let walletTokenAccount = getAssociatedTokenAddressSync(bet.mint, address);
      if (bet.currency.name === 'SOL') {
        const accountRentExempt = await conn.getMinimumBalanceForRentExemption(
          AccountLayout.span,
        );
        const newAccount = Keypair.generate();
        ins.push(
          SystemProgram.createAccount({
            fromPubkey: address,
            newAccountPubkey: newAccount.publicKey,
            lamports: bet.amount + accountRentExempt * 3,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
          }),
        );
        ins.push(
          createInitializeAccountInstruction(
            newAccount.publicKey,
            NATIVE_MINT,
            address,
          ),
        );
        walletTokenAccount = newAccount.publicKey;
      } else {
        if ((await conn.getAccountInfo(walletTokenAccount)) == null) {
          ins.push(
            createAssociatedTokenAccountInstruction(
              address,
              walletTokenAccount,
              address,
              bet.mint,
            ),
          );
        }
      }
      ins.push(
        program.instruction.redeem({
          accounts: {
            wallet: address,
            leaderboard: leaderboard,
            pool: POOL_DATA.address,
            game: bet.game,
            bet: bet.address,
            walletTokenAccount: walletTokenAccount,
            poolTokenAccount: bet.currency.tokenAccount,
            tokenProgram: TOKEN_PROGRAM_ID,
          },
        }),
      );
      if (bet.currency.name === 'SOL') {
        ins.push(
          createCloseAccountInstruction(
            walletTokenAccount,
            address,
            address,
            [],
          ),
        );
      }

      instructions.push(ins);
      signers.push([]);
      await sendTransactions(conn, wallet, instructions, signers);
    },
    [publicKey, wallet, conn, program],
  );

  return (
    <ProgramContext.Provider
      value={{
        verified,
        isGameLoading,
        isBetLoading,
        isOpenBetLoading,
        isLeaderboardLoading,
        games,
        bets,
        openBets,
        leaderboard,
        getLeaderboard,
        getGames,
        getGame,
        getBets,
        getOpenBets,
        analysisTokenAmount,
        createGame,
        updateGame,
        resultGame,
        createP2PBet,
        acceptP2PBet,
        acceptP2POpenBet,
        cancelP2PBet,
        withdrawP2PBet,
        createHouseBet,
        withdrawHouseBet,
        redeem,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
