import { useWallet } from '@solana/wallet-adapter-react';

import { openNotification } from '@Utils/constant';

export default function UpcommingGameComponent(props: any) {
  const { publicKey } = useWallet();
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      <span className="game-content">
        {props.data.team1} <span className="vs-word">VS</span>{' '}
        {props.data.team2}
        <br />
        <span className="game-time">
          {new Date(props.data.time * 1000).toString()}
        </span>
      </span>
      <span>
        <button
          className="p2p-btn"
          onClick={async () => {
            if (publicKey == null) {
              openNotification('warning', 'Please connect wallet');
              return;
            }
            props.callbackOpen({ ...props.data, isP2P: true });
          }}
        >
          Peer to Peer Bet
        </button>
        <button
          className="house-btn"
          onClick={async () => {
            if (publicKey == null) {
              openNotification('warning', 'Please connect wallet');
              return;
            }
            props.callbackOpen({ ...props.data, isP2P: false });
          }}
        >
          Bet Against House
        </button>
      </span>
    </li>
  );
}
