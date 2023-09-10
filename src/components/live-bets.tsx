import { useWallet } from '@solana/wallet-adapter-react';

import { CATEGORIES } from '@Utils/constant';

export default function LiveBetComponent(props: any) {
  const { publicKey } = useWallet();
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span className="bet-content">
        {publicKey != null &&
        publicKey.toBase58() === props.data.wallet1.toBase58() ? (
          <div className="first-line">
            {props.data.gameData.team1} <b>VS</b> {props.data.gameData.team2}{' '}
            <span>
              (Against{' '}
              <u>
                {props.data.betType === 0
                  ? props.data.wallet2.toBase58().substr(0, 4) +
                    '...' +
                    props.data.wallet2.toBase58().substr(-4)
                  : 'the House'}
              </u>
              )
            </span>
          </div>
        ) : (
          <div className="first-line">
            {props.data.gameData.team1} <b>VS</b> {props.data.gameData.team2}{' '}
            <span>
              (Against{' '}
              <u>
                {props.data.wallet1.toBase58().substr(0, 4) +
                  '...' +
                  props.data.wallet1.toBase58().substr(-4)}
              </u>
              )
            </span>
          </div>
        )}
        {props.data.betType === 0 ? (
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
        <div className="status live-status">
          <span />
          &nbsp;Live
        </div>
      </span>
    </li>
  );
}
