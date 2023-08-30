export default function LeaderboardComponent(props : any){
    return <li className='list-group-item'>
        <span className='wallet'>
            {props.data.wallet.substr(0,6)+"..."+props.data.wallet.substr(-6)}
        </span>
        <span className='win'>
            {props.data.winCount===0 ? '_' : props.data.winCount}
        </span>
        <span className='loss'>
            {props.data.lossCount===0 ? '_' : props.data.lossCount}
        </span>
        <span className='tie'>
            {props.data.tieCount===0 ? '_' : props.data.tieCount}
        </span>
        <span className="total">
            <img src={props.currency.logo} alt="SOL" width="28px" height="28px"/>&nbsp;{props.data.totalWager}
        </span>
    </li>
}