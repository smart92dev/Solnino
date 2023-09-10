import CHECK_IMG from '@Assets/images/check.png';

export default function LastGameComponent(props: any) {
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

      <span className="status-component">
        {props.data.status === 0 ? (
          <div className="status pending-status">
            <span />
            &nbsp;Pending
          </div>
        ) : props.data.status === 3 ? (
          <div className="status no-winner-status">
            <span />
            &nbsp;No Winner
          </div>
        ) : props.data.status === 1 ? (
          <div className="status winner-status">
            <img src={CHECK_IMG} alt="Win" width="30px"></img>&nbsp;
            {props.data.team1}
          </div>
        ) : (
          <div className="status winner-status">
            <img src={CHECK_IMG} alt="Win" width="30px"></img>&nbsp;
            {props.data.team2}
          </div>
        )}
      </span>
    </li>
  );
}
