import { CircularProgress } from "@mui/material";
import { useState } from "react"
import { openNotification } from "../utils/constant"
import { useProgram } from "../utils/useProgram";
export default function CurrentBetComponent(props : any){
    const {resultGame} = useProgram()
    const [sel, setSel] = useState(3)
    const [isWaiting, setIsWaiting] = useState(false)

    return <li className='list-group-item'>
        <span className='bet-content'>
            <div className={sel===1 ? "team team-a active border-none" : sel===2 ? "team team-a border-none" : "team team-a"} onClick={()=>{setSel(sel===1 ? 3 : 1)}}>{props.data.team1}</div>
            <div className={sel===2 ? "team team-b active" : "team team-b"} onClick={()=>{setSel(sel===2 ? 3 : 2)}}>{props.data.team2}</div>
            <div className="vs-component">VS</div>
        </span>
        <span className='total-bet'>
            {props.data.totalBet}
        </span>
        <span className='button-part'>
        {
            props.data.time*1000 < (new Date()).getTime() ?
                <button className="confirm-btn" disabled={isWaiting} onClick={async()=>{
                    setIsWaiting(true)
                    try{
                        if(sel===0){
                            setIsWaiting(false)
                            openNotification('error','Please select a winner')
                            return
                        }
                        await resultGame(props.data.address, sel)
                        openNotification('success','Confirmed')
                    }catch(err){
                        openNotification('error','Something went wrong!')
                    }
                    setIsWaiting(false)
                }}>
                {
                    isWaiting ?
                        <CircularProgress color="inherit" disableShrink/>
                    :
                        "Confirm Result"
                }</button>
            :
                (new Date(props.data.time*1000)).toString()        
        }
        </span>
        <span className="button-part">
            <button className="update-btn" onClick={()=>{
                window.location.href="/admin/update-match/"+props.data.address.toBase58()
            }}>Update</button>
        </span>
    </li>
}