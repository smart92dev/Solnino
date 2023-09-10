import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useWallet } from '@solana/wallet-adapter-react';

import { CATEGORIES, openNotification } from '@Utils/constant';
import { useProgram } from '@Utils/useProgram';

export default function PrevBetComponent(props: any) {
  const { cancelP2PBet, withdrawP2PBet, withdrawHouseBet, redeem, getBets } =
    useProgram();
  const { publicKey } = useWallet();
  const [isWaiting, setIsWaiting] = useState(false);

  const redeemFunds = async () => {
    setIsWaiting(true);
    try {
      await redeem(props.data);
      openNotification('success', 'Redeem successfully');
      getBets();
    } catch (err) {
      // console.log(err)
      openNotification('error', 'Something went wrong.');
    }
    setIsWaiting(false);
  };

  const withdraw = async () => {
    setIsWaiting(true);
    try {
      if (props.data.betType === 0) {
        await withdrawP2PBet(props.data);
      } else {
        await withdrawHouseBet(props.data);
      }
      openNotification('success', 'Withdraw successfully');
      getBets();
    } catch (err) {
      openNotification('error', 'Something went wrong.');
    }
    setIsWaiting(false);
  };

  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span className="bet-content">
        <div className="first-line">
          {props.data.gameData.team1} <b>VS</b> {props.data.gameData.team2}
        </div>
        {props.data.status === 0 ? (
          <div className="second-line">Your friend didn't accept this bet</div>
        ) : props.data.betType === 0 ? (
          publicKey != null &&
          publicKey.toBase58() === props.data.wallet1.toBase58() ? (
            <div className="second-line">
              Your friend bets that{' '}
              <span>
                {props.data.select === 1
                  ? props.data.gameData.team2
                  : props.data.gameData.team1}
              </span>{' '}
              will win this {CATEGORIES[props.data.gameData.category].name}{' '}
              match.
            </div>
          ) : (
            <div className="second-line">
              Your friend bets that{' '}
              <span>
                {props.data.select === 1
                  ? props.data.gameData.team1
                  : props.data.gameData.team2}
              </span>{' '}
              will win this {CATEGORIES[props.data.gameData.category].name}{' '}
              match.
            </div>
          )
        ) : (
          <div className="second-line">
            You bet that{' '}
            <span>
              {props.data.select === 1
                ? props.data.gameData.team1
                : props.data.gameData.team2}
            </span>{' '}
            will win this {CATEGORIES[props.data.gameData.category].name} match
            against the house.
          </div>
        )}
        <div className="third-line">
          Wager&nbsp;:&nbsp;&nbsp;
          <img
            alt={props.data.currency.name}
            src={props.data.currency.logo}
          ></img>
          <span>
            &nbsp;
            {(
              props.data.amount /
              10 ** props.data.currency.decimals
            ).toLocaleString() +
              ' ' +
              props.data.currency.name}
          </span>
        </div>
      </span>
      <span className="status-component">
        {props.data.status === 0 ? (
          <button
            className="close-bet-btn"
            disabled={isWaiting}
            onClick={async () => {
              setIsWaiting(true);
              try {
                await cancelP2PBet(props.data);
                openNotification('success', 'Cancelled successfully.');
              } catch (err) {
                // console.log(err)
                openNotification('error', 'Something went wrong.');
              }
              setIsWaiting(false);
            }}
          >
            {isWaiting === false ? (
              'Close Bet'
            ) : (
              <CircularProgress color="inherit" disableShrink />
            )}
          </button>
        ) : props.data.gameData.status === 0 ? (
          <div className="status pending-status">
            <span />
            &nbsp;Pending
          </div>
        ) : props.data.gameData.status === 3 ? (
          publicKey != null &&
          (props.data.status === 1 ||
            (props.data.status === 3 &&
              publicKey.toBase58() === props.data.wallet2.toBase58()) ||
            (props.data.status === 4 &&
              publicKey.toBase58() === props.data.wallet1.toBase58())) ? (
            isWaiting ? (
              <button className="withdraw-btn">
                <CircularProgress color="inherit" disableShrink />
              </button>
            ) : (
              <button
                className="withdraw-btn"
                onClick={async () => {
                  await redeemFunds();
                }}
              >
                Redeem Funds
              </button>
            )
          ) : (
            <div className="status tie-status">
              <span />
              &nbsp;Tie
            </div>
          )
        ) : props.data.gameData.status === 1 ? (
          publicKey != null &&
          publicKey.toBase58() === props.data.wallet1.toBase58() ? (
            props.data.select === 1 ? (
              props.data.status === 1 ? (
                isWaiting ? (
                  <button className="withdraw-btn">
                    <CircularProgress color="inherit" disableShrink />
                  </button>
                ) : (
                  <button
                    className="withdraw-btn"
                    onClick={async () => {
                      await withdraw();
                    }}
                  >
                    Withdraw Rewards
                  </button>
                )
              ) : (
                <div className="status won-status">
                  <span />
                  &nbsp;Won
                </div>
              )
            ) : (
              <div className="status lost-status">
                <span />
                &nbsp;Lost
              </div>
            )
          ) : props.data.select === 2 ? (
            props.data.status === 1 ? (
              isWaiting ? (
                <button className="withdraw-btn">
                  <CircularProgress color="inherit" disableShrink />
                </button>
              ) : (
                <button
                  className="withdraw-btn"
                  onClick={async () => {
                    await withdraw();
                  }}
                >
                  Withdraw Rewards
                </button>
              )
            ) : (
              <div className="status won-status">
                <span />
                &nbsp;Won
              </div>
            )
          ) : (
            <div className="status lost-status">
              <span />
              &nbsp;Lost
            </div>
          )
        ) : publicKey != null &&
          publicKey.toBase58() === props.data.wallet1.toBase58() ? (
          props.data.select === 2 ? (
            props.data.status === 1 ? (
              isWaiting ? (
                <button className="withdraw-btn">
                  <CircularProgress color="inherit" disableShrink />
                </button>
              ) : (
                <button
                  className="withdraw-btn"
                  onClick={async () => {
                    await withdraw();
                  }}
                >
                  Withdraw Rewards
                </button>
              )
            ) : (
              <div className="status won-status">
                <span />
                &nbsp;Won
              </div>
            )
          ) : (
            <div className="status lost-status">
              <span />
              &nbsp;Lost
            </div>
          )
        ) : props.data.select === 1 ? (
          props.data.status === 1 ? (
            isWaiting ? (
              <button className="withdraw-btn">
                <CircularProgress color="inherit" disableShrink />
              </button>
            ) : (
              <button
                className="withdraw-btn"
                onClick={async () => {
                  await withdraw();
                }}
              >
                Withdraw Rewards
              </button>
            )
          ) : (
            <div className="status won-status">
              <span />
              &nbsp;Won
            </div>
          )
        ) : (
          <div className="status lost-status">
            <span />
            &nbsp;Lost
          </div>
        )}
      </span>
    </li>
  );
}
