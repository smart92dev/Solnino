import { CircularProgress } from "@mui/material"
import { useWallet } from "@solana/wallet-adapter-react"
import { useState } from "react"
import { CATEGORIES, openNotification, POOL_DATA } from "../utils/constant"
import { useProgram } from "../utils/useProgram"

export default function PendingBetComponent(props : any){
    const {acceptP2PBet, cancelP2PBet, getBets} = useProgram()
    const {publicKey} = useWallet()
    const [isWaiting, setIsWaiting] = useState(false)
    return <li className='list-group-item d-flex justify-content-between align-items-center'>
        <span className='bet-content'>
            <div className="first-line">{props.data.gameData.team1} <b>VS</b> {props.data.gameData.team2}</div>
            {
                publicKey!=null && publicKey.toBase58()===props.data.wallet2.toBase58() ?
                    <div className="second-line">Your friend bets that <span>{props.data.select===1 ? props.data.gameData.team1 : props.data.gameData.team2}</span> will win this {CATEGORIES[props.data.gameData.category].name} match.</div>
                :
                    <div className="second-line">You bet that <span>{props.data.select===1 ? props.data.gameData.team1 : props.data.gameData.team2}</span> will win this {CATEGORIES[props.data.gameData.category].name} match. Now waiting that {props.data.wallet2.toBase58()===POOL_DATA.address.toBase58() ? "someone" : "your friend"} accepts.</div>
            }
            <div className="third-line">Wager&nbsp;:&nbsp;&nbsp;<img alt={props.data.currency.name} src={props.data.currency.logo}></img><span>&nbsp;{(props.data.amount/(10**props.data.currency.decimals)).toLocaleString()+" "+props.data.currency.name}</span></div>
        </span>
        <span>
        {
            publicKey!=null && publicKey.toBase58()===props.data.wallet2.toBase58() ?
                <button className='accept-btn' disabled={isWaiting} onClick={async()=>{
                    setIsWaiting(true)
                    try{
                        await acceptP2PBet(props.data)
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
            :
                <button className='close-bet-btn' disabled={isWaiting} onClick={async()=>{
                    setIsWaiting(true)
                    try{
                        await cancelP2PBet(props.data)
                        openNotification('success', 'Cancelled successfully.')
                        getBets()
                    }catch(err){
                        openNotification('error', 'Something went wrong.')
                    }
                    setIsWaiting(false)
                }}>
                {
                    isWaiting===false ?
                        "Close Bet"
                    :
                        <CircularProgress color="inherit" disableShrink/>
                }
                </button>
        }
        </span>
    </li>
}