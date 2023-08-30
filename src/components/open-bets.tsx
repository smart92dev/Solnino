import { CircularProgress } from "@mui/material"
import { useState } from "react"
import { CATEGORIES, openNotification } from "../utils/constant"
import { useProgram } from "../utils/useProgram"

export default function OpenBetComponent(props : any){
    const {acceptP2POpenBet, getBets} = useProgram()
    const [isWaiting, setIsWaiting] = useState(false)
    return <li className='list-group-item d-flex justify-content-between align-items-center'>
        <span className='bet-content'>
            <div className="first-line">{props.data.gameData.team1} <b>VS</b> {props.data.gameData.team2}</div>
                <div className="second-line">({props.data.wallet1.toBase58().substr(0,3)+"..."+props.data.wallet1.toBase58().substr(-3)}) bet that <span>{props.data.select===1 ? props.data.gameData.team1 : props.data.gameData.team2}</span> will win this {CATEGORIES[props.data.gameData.category].name} match. Now waiting that someone accepts.</div>
            <div className="third-line">Wager&nbsp;:&nbsp;&nbsp;<img alt={props.data.currency.name} src={props.data.currency.logo}></img><span>&nbsp;{(props.data.amount/(10**props.data.currency.decimals)).toLocaleString()+" "+props.data.currency.name}</span></div>
        </span>
        <span>
        <button className='p2p-btn' disabled={isWaiting} onClick={async()=>{
            setIsWaiting(true)
            try{
                await acceptP2POpenBet(props.data)
                openNotification('success', 'Accepted successfully.')
                getBets()
            }catch(err){
                // openNotification('error', 'Something went wrong.')
            }
            setIsWaiting(false)
        }}>
        {
            isWaiting===false ? 
                "Accept Bet"
            :
                <CircularProgress color="inherit" disableShrink/>
        }
        </button>
        </span>
    </li>
}