import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import CachedIcon from '@mui/icons-material/Cached';
import {
  CircularProgress,
  Dialog,
  MenuItem,
  Select,
  SelectChangeEvent,
  Checkbox,
} from '@mui/material';
import axios from 'axios';

import {
  MessageAlert,
  DarkModeButton,
  Menu,
  Footer,
  UpcommingGameComponent,
  LiveBetComponent,
  PendingBetComponent,
  PrevBetComponent,
} from '@Components/index';
import LastGameComponent from '@Components/last-games';
import InfoComponent from '@Components/info';
import OpenBetComponent from '@Components/open-bets';
import {
  CATEGORIES,
  CURRENCIES,
  P2P_CURRENCIES,
  HOUSE_CURRENCIES,
  openNotification,
  POOL_DATA,
} from '@Utils/constant';
import { useProgram } from '@Utils/useProgram';
import { useTheme } from '@Utils/useTheme';
import SHARK_IMG from '@Assets/images/shark.png';
import ALL_IMG from '@Assets/images/All.png';

export default function Home() {
  const { isDark } = useTheme();
  const {
    bets,
    openBets,
    games,
    createP2PBet,
    createHouseBet,
    getBets,
    getOpenBets,
    isBetLoading,
    isOpenBetLoading,
    isGameLoading,
    getGames,
  } = useProgram();

  const { publicKey } = useWallet();

  const [selUserState, setSelUserState] = useState(0);
  const [selGameState, setSelGameState] = useState(0);
  const [category, setCategory] = useState('ALL');

  const [selectedGame, setSelectedGame] = useState<any>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(CURRENCIES[0].name);
  const [selectedTeam, setSelectedTeam] = useState(1);
  const [isOpenBet, setIsOpenBet] = useState(true);
  const [opWalletAddress, setOpWalletAddress] = useState('');
  const [wagerAmount, setWagerAmount] = useState('');
  const [isWagerAmount, setIsWagerAmount] = useState(true);
  const [successBet, setSuccessBet] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    getGames();
    getOpenBets();
  }, []);

  useEffect(() => {
    getBets();
    getOpenBets();
  }, [publicKey]);

  const handleAssetChange = (event: SelectChangeEvent) => {
    setSelectedAsset(event.target.value as string);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  const handleClickOpen = (game: any) => {
    setSelectedGame(game);
    if (game.isP2P) {
      setSelectedAsset(CURRENCIES[P2P_CURRENCIES[0]].name);
    } else {
      setSelectedAsset(CURRENCIES[HOUSE_CURRENCIES[0]].name);
    }
    setDialogOpen(true);
  };

  const handleClose = () => {
    setSelectedGame(null);
    setSuccessBet(false);
    setDialogOpen(false);
  };

  const tweetCreateBet = async (param: any) => {
    await axios.post('https://solnino.io/server/api/tweet', param);
  };

  return (
    <>
      <div
        className={
          isDark ? 'content text-center dark-mode' : 'content text-center'
        }
      >
        <MessageAlert />
        <Menu />
        <div className="topic-part">
          <div className="shark-image">
            <img src={SHARK_IMG} alt="SHARK"></img>
          </div>
          <h1>
            P2P Sports
            <br />
            betting is here
          </h1>
          <p>The lowest sports betting fees in the universe.</p>
        </div>
        <div id="bet"></div>
        {publicKey != null && (
          <div className="game-status-panel">
            <div className="game-status-panel-header">
              <nav className="navbar navbar-expand-sm">
                <ul className="navbar-nav">
                  <li
                    className={
                      selUserState === 0 ? 'header-tab active' : 'header-tab'
                    }
                    onClick={() => {
                      setSelUserState(0);
                    }}
                  >
                    Pending Bets
                    <hr />
                  </li>
                  <li
                    className={
                      selUserState === 1 ? 'header-tab active' : 'header-tab'
                    }
                    onClick={() => {
                      setSelUserState(1);
                    }}
                  >
                    Open Bets
                    <hr />
                  </li>
                  <li
                    className={
                      selUserState === 2 ? 'header-tab active' : 'header-tab'
                    }
                    onClick={() => {
                      setSelUserState(2);
                    }}
                  >
                    Live Bets
                    <hr />
                  </li>
                  <li
                    className={
                      selUserState === 3 ? 'header-tab active' : 'header-tab'
                    }
                    onClick={() => {
                      setSelUserState(3);
                    }}
                  >
                    Previous Bets
                    <hr />
                  </li>
                  <li className="header-tab active">
                    <CachedIcon
                      fontSize="large"
                      sx={{ color: isDark ? 'white' : 'black' }}
                      onClick={() => {
                        if (selUserState === 1) getOpenBets();
                        else getBets();
                      }}
                    />
                  </li>
                </ul>
              </nav>
            </div>
            <div className="game-status-panel-body">
              <ul className="list-group list-group-flush">
                {selUserState === 1 ? (
                  isOpenBetLoading ? (
                    <InfoComponent words="Loading..." />
                  ) : openBets.find(function (item) {
                      let currentTime = new Date().getTime() / 1000;
                      return (
                        (publicKey == null ||
                          publicKey.toBase58() !== item.wallet1.toBase58()) &&
                        currentTime < item.gameData.time
                      );
                    }) === undefined ? (
                    <InfoComponent words="No Bets"></InfoComponent>
                  ) : (
                    openBets.map((item, idx) => {
                      let currentTime = new Date().getTime() / 1000;
                      if (
                        (publicKey == null ||
                          publicKey.toBase58() !== item.wallet1.toBase58()) &&
                        currentTime < item.gameData.time
                      ) {
                        return (
                          <OpenBetComponent
                            key={idx}
                            data={item}
                          ></OpenBetComponent>
                        );
                      } else return <></>;
                    })
                  )
                ) : isBetLoading ? (
                  <InfoComponent words="Loading..." />
                ) : bets.find(function (item) {
                    let currentTime = new Date().getTime() / 1000;
                    return (
                      (selUserState === 0 &&
                        item.status === 0 &&
                        currentTime < item.gameData.time) ||
                      (selUserState === 2 &&
                        item.status === 1 &&
                        currentTime < item.gameData.time) ||
                      (selUserState === 3 &&
                        currentTime > item.gameData.time &&
                        (item.status !== 0 ||
                          publicKey.toBase58() !== item.wallet2.toBase58()))
                    );
                  }) === undefined ? (
                  <InfoComponent words="No Bets"></InfoComponent>
                ) : (
                  bets.map((item, idx) => {
                    let currentTime = new Date().getTime() / 1000;
                    if (selUserState === 0) {
                      if (
                        item.betType === 0 &&
                        item.status === 0 &&
                        currentTime < item.gameData.time
                      ) {
                        return (
                          <PendingBetComponent
                            key={idx}
                            data={item}
                            isOpenBet={false}
                          />
                        );
                      } else return <></>;
                    } else if (selUserState === 2) {
                      if (
                        (item.betType === 1 ||
                          (item.betType === 0 && item.status === 1)) &&
                        currentTime < item.gameData.time
                      )
                        return <LiveBetComponent key={idx} data={item} />;
                      else return <></>;
                    } else {
                      if (currentTime > item.gameData.time)
                        if (
                          item.status === 0 &&
                          publicKey.toBase58() === item.wallet2.toBase58()
                        )
                          return <></>;
                        else return <PrevBetComponent key={idx} data={item} />;
                      else return <></>;
                    }
                  })
                )}
              </ul>
            </div>
          </div>
        )}
        <div className="game-status-panel">
          <div className="game-status-panel-header">
            <div className="tab-items">
              <nav className="navbar navbar-expand-sm">
                <ul className="navbar-nav">
                  <li
                    className={
                      selGameState === 0 ? 'header-tab active' : 'header-tab'
                    }
                    onClick={() => {
                      setSelGameState(0);
                    }}
                  >
                    Upcoming Games
                    <hr />
                  </li>
                  <li
                    className={
                      selGameState === 1 ? 'header-tab active' : 'header-tab'
                    }
                    onClick={() => {
                      setSelGameState(1);
                    }}
                  >
                    Last Results
                    <hr />
                  </li>
                  <li className="header-tab active">
                    <CachedIcon
                      fontSize="large"
                      sx={{ color: isDark ? 'white' : 'black' }}
                      onClick={() => {
                        getGames();
                      }}
                    />
                  </li>
                </ul>
              </nav>
            </div>
            <div className="header-tab-right">
              <Select onChange={handleSelectChange} value={category}>
                <MenuItem value="ALL" key={0}>
                  <img src={ALL_IMG} width="20px" height="20px" alt="ALL"></img>
                  &nbsp;&nbsp;All Sports
                </MenuItem>
                {CATEGORIES.map((item, idx) => {
                  return (
                    <MenuItem value={item.name} key={idx + 1}>
                      <img
                        src={item.logo}
                        width="20px"
                        height="20px"
                        alt={item.name}
                      ></img>
                      &nbsp;&nbsp;{item.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="game-status-panel-body">
            <ul className="list-group list-group-flush">
              {isGameLoading === true ? (
                <InfoComponent words="Loading..." />
              ) : selGameState === 0 ? (
                games.find(function (item) {
                  let currentTime = new Date().getTime() / 1000;
                  return (
                    item.status === 0 &&
                    item.time > currentTime &&
                    (category === CATEGORIES[item.category].name ||
                      category === 'ALL')
                  );
                }) === undefined ? (
                  <InfoComponent words="No Games"></InfoComponent>
                ) : (
                  games
                    .slice(0)
                    .reverse()
                    .map((item, idx) => {
                      let currentTime = new Date().getTime() / 1000;
                      if (
                        item.status === 0 &&
                        item.time > currentTime &&
                        (category === CATEGORIES[item.category].name ||
                          category === 'ALL')
                      )
                        return (
                          <UpcommingGameComponent
                            key={idx}
                            data={item}
                            callbackOpen={handleClickOpen}
                          />
                        );
                      else return <></>;
                    })
                )
              ) : games.find(function (item) {
                  let currentTime = new Date().getTime() / 1000;
                  return (
                    item.time < currentTime &&
                    (category === CATEGORIES[item.category].name ||
                      category === 'ALL')
                  );
                }) === undefined ? (
                <InfoComponent words="No Games"></InfoComponent>
              ) : (
                games.map((item, idx) => {
                  let currentTime = new Date().getTime() / 1000;
                  if (
                    item.time < currentTime &&
                    (category === CATEGORIES[item.category].name ||
                      category === 'ALL')
                  )
                    return <LastGameComponent key={idx} data={item} />;
                  else return <></>;
                })
              )}
            </ul>
          </div>
        </div>
        {selectedGame != null && (
          <Dialog
            fullWidth={true}
            maxWidth="md"
            onClose={handleClose}
            open={dialogOpen}
          >
            {successBet === false ? (
              <div
                className={
                  isDark
                    ? 'bet-modal-container dark-modal'
                    : 'bet-modal-container'
                }
              >
                <div className="bet-modal-button-close-wrapper">
                  <div onClick={handleClose} className="bet-modal-button-close">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="close-svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="bet-modal-header">
                  {selectedGame.isP2P
                    ? 'Start Your P2P Bet'
                    : 'Start Your House Bet'}
                </div>
                <div className="bet-modal-subheader">
                  Select the team you bet will win this match.
                </div>
                <div className="bet-modal-selector">
                  <div
                    className={
                      selectedTeam === 1 ? 'team teamA active' : 'team teamA'
                    }
                    onClick={() => {
                      setSelectedTeam(1);
                    }}
                  >
                    {selectedGame.team1}
                  </div>
                  <div
                    className={
                      selectedTeam === 2 ? 'team teamB active' : 'team teamB'
                    }
                    onClick={() => {
                      setSelectedTeam(2);
                    }}
                  >
                    {selectedGame.team2}
                  </div>
                  <div className="vs-component">VS</div>
                </div>
                {selectedGame.isP2P === true && (
                  <div className="bet-modal-open-bet">
                    <Checkbox
                      checked={isOpenBet}
                      disabled={isWaiting}
                      onChange={(event) => {
                        setIsOpenBet(event.target.checked);
                      }}
                      sx={{
                        color: isDark
                          ? 'rgb(161, 240, 58)'
                          : 'rgb(202, 42, 96)',
                        '&.Mui-checked': {
                          color: isDark
                            ? 'rgb(161, 240, 58)'
                            : 'rgb(202, 42, 96)',
                        },
                      }}
                    />
                    You want an open bet?
                  </div>
                )}
                {selectedGame.isP2P === true && (
                  <div className="bet-modal-op-wallet">
                    <input
                      placeholder="Enter your friend's wallet address"
                      disabled={isOpenBet}
                      value={opWalletAddress}
                      onChange={(event) => {
                        setOpWalletAddress(event.target.value);
                      }}
                    ></input>
                  </div>
                )}
                <div className="bet-modal-token-info">
                  <div className="bet-modal-token-amount">
                    <input
                      className={isWagerAmount ? '' : 'invalid-input'}
                      placeholder="Wager Amount"
                      disabled={isWaiting}
                      value={wagerAmount}
                      onChange={(event) => {
                        let amount = Number(event.target.value);
                        if (
                          amount <= 0 ||
                          isNaN(amount) ||
                          (amount > 2500 && selectedGame.isP2P === false)
                        )
                          setIsWagerAmount(false);
                        else setIsWagerAmount(true);
                        setWagerAmount(event.target.value);
                      }}
                    ></input>
                    {selectedGame.isP2P === false && (
                      <div className="bet-explanation">
                        Bets against the house are only available in select
                        tokens
                      </div>
                    )}
                  </div>
                  <div className="bet-modal-token-asset">
                    <Select onChange={handleAssetChange} value={selectedAsset}>
                      {selectedGame.isP2P
                        ? P2P_CURRENCIES.map((item, idx) => {
                            return (
                              <MenuItem value={CURRENCIES[item].name} key={idx}>
                                <img
                                  src={CURRENCIES[item].logo}
                                  width="20px"
                                  height="20px"
                                  alt={CURRENCIES[item].name}
                                ></img>
                                &nbsp;&nbsp;{CURRENCIES[item].name}
                              </MenuItem>
                            );
                          })
                        : HOUSE_CURRENCIES.map((item, idx) => {
                            return (
                              <MenuItem value={CURRENCIES[item].name} key={idx}>
                                <img
                                  src={CURRENCIES[item].logo}
                                  width="20px"
                                  height="20px"
                                  alt={CURRENCIES[item].name}
                                ></img>
                                &nbsp;&nbsp;{CURRENCIES[item].name}
                              </MenuItem>
                            );
                          })}
                    </Select>
                  </div>
                </div>
                <div className="bet-modal-confirm">
                  {isWaiting ? (
                    <button>
                      <CircularProgress color="inherit" disableShrink />
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        setIsWaiting(true);
                        if (publicKey == null) {
                          setIsWaiting(false);
                          openNotification('error', 'Wallet Error');
                          return;
                        }
                        if (selectedGame.isP2P && isOpenBet === false) {
                          try {
                            let opWallet = new PublicKey(opWalletAddress);
                            if (
                              opWallet.toBase58() === publicKey.toBase58() ||
                              opWallet.toBase58() ===
                                POOL_DATA.address.toBase58()
                            )
                              throw new Error('the same wallet');
                          } catch (err) {
                            setIsWaiting(false);
                            openNotification('error', 'Invalid friend wallet');
                            return;
                          }
                        }
                        let currency = CURRENCIES[0];
                        for (let item of CURRENCIES) {
                          if (item.name === selectedAsset) {
                            currency = item;
                            break;
                          }
                        }
                        let amount = Number(wagerAmount);
                        if (amount <= 0 || isNaN(amount)) {
                          setIsWaiting(false);
                          openNotification(
                            'error',
                            'Please check the amount you bet',
                          );
                          return;
                        }
                        if (amount > 2500 && selectedGame.isP2P === false) {
                          setIsWaiting(false);
                          openNotification(
                            'error',
                            'You can bet less than 2500 ' + currency.name,
                          );
                          return;
                        }
                        try {
                          let game = selectedGame;
                          if (selectedGame.isP2P) {
                            let opWallet = isOpenBet
                              ? POOL_DATA.address
                              : new PublicKey(opWalletAddress);
                            await createP2PBet(
                              selectedGame.address,
                              currency,
                              amount,
                              selectedTeam,
                              opWallet,
                            );
                            try {
                              if (
                                opWallet.toBase58() ===
                                POOL_DATA.address.toBase58()
                              ) {
                                tweetCreateBet({
                                  betType: 0,
                                  wallet: publicKey.toBase58(),
                                  amount: amount,
                                  currency: currency.name,
                                  team1: game.team1,
                                  team2: game.team2,
                                });
                              } else {
                                tweetCreateBet({
                                  betType: 1,
                                  wallet: publicKey.toBase58(),
                                  amount: amount,
                                  currency: currency.name,
                                  team1: game.team1,
                                  team2: game.team2,
                                });
                              }
                            } catch (err) {}
                          } else {
                            await createHouseBet(
                              selectedGame.address,
                              currency,
                              amount,
                              selectedTeam,
                            );
                            try {
                              tweetCreateBet({
                                betType: 2,
                                wallet: publicKey.toBase58(),
                                amount: amount,
                                currency: currency.name,
                                team1: game.team1,
                                team2: game.team2,
                              });
                            } catch (err) {}
                          }
                          setSuccessBet(true);
                          getBets();
                          getOpenBets();
                        } catch (err) {
                          console.log(err);
                          // openNotification('error','Something went wrong!')
                        }
                        setIsWaiting(false);
                      }}
                    >
                      Send Bet
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bet-modal-container">
                <div className="bet-modal-button-close-wrapper">
                  <div onClick={handleClose} className="bet-modal-button-close">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="close-svg"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div className="bet-modal-header">
                  {selectedGame.isP2P
                    ? isOpenBet
                      ? 'Open Bet Created'
                      : 'P2P Bet Submitted'
                    : 'House Bet Submitted'}
                </div>
                <div className="bet-modal-subheader">
                  {selectedGame.isP2P
                    ? isOpenBet
                      ? 'Once someone accepts your bet, it will appear in your live bets'
                      : 'Once your friend has accepted the bet, it will appear under your Live Bets.'
                    : 'Your bet is now live. Thanks for using SOLNino'}
                </div>
              </div>
            )}
          </Dialog>
        )}
      </div>
      <DarkModeButton />
      <Footer />
    </>
  );
}
