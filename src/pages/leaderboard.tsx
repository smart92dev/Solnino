import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState, useEffect } from 'react';
import { DarkModeButton, Menu, MessageAlert, Footer } from '../components';
import InfoComponent from '../components/info';
import LeaderboardComponent from '../components/leaderboard';
import { P2P_CURRENCIES, CURRENCIES } from '../utils/constant';

import { useProgram } from '../utils/useProgram';
import { useTheme } from '../utils/useTheme';
// import CachedIcon from '@mui/icons-material/Cached';

export default function Leaderboard(){
    const {isDark} = useTheme()
    const {leaderboard, isLeaderboardLoading, getLeaderboard} = useProgram()
    const [selectedAsset, setSelectedAsset] = useState(CURRENCIES[0].name)
    const [currency, setCurrency] = useState(CURRENCIES[0])
    const [leaders, setLeaders] = useState<any[]>([])

    useEffect(()=>{
        getLeaderboard()
    },[])

    useEffect(()=>{
        let allItems = []
        for(let item of leaderboard){
            for(let wager of item.wagerData){
                if(wager.mint.toBase58()===currency.mint.toBase58() && wager.totalWager.toNumber()!==0){
                    allItems.push({
                        wallet: item.wallet,
                        winCount: wager.winCount,
                        lossCount: wager.lossCount,
                        tieCount: wager.tieCount,
                        totalWager: wager.totalWager.toNumber()/(10**currency.decimals)
                    })
                    break;
                }
            }
        }
        allItems.sort(function(a : any, b: any){
            if(a.winCount > b.winCount){return -1}
            if(a.winCount < b.winCount){return 1}
            if(a.totalWager > b.totalWager){return -1}
            if(a.totalWager < b.totalWager){return 1}
            return 0
        })
        setLeaders(allItems)
    },[currency, leaderboard])

    const handleAssetChange = (event : SelectChangeEvent)=>{
        for(let item of CURRENCIES){
            if(item.name===event.target.value){
                setCurrency(item)
                break;
            }
        }
        setSelectedAsset(event.target.value as string)
    }
    return <>
        <div className={isDark ? "content text-center dark-mode" : "content text-center"}>
            <MessageAlert/>
            <Menu/>
            <div className='create-match-panel'>
                <h1>Leaderboard</h1>
                <p>Find out who's the best better of them all.</p>
            </div>
            <div className='leaderboard-panel'>
                <div className='token-asset'>
                    <Select onChange={handleAssetChange} value={selectedAsset}>
                    {
                        P2P_CURRENCIES.map((item, idx)=>{
                            return <MenuItem value={CURRENCIES[item].name} key={idx}><img src={CURRENCIES[item].logo} width="20px" height="28px" alt={CURRENCIES[item].name}></img>&nbsp;&nbsp;{CURRENCIES[item].name}</MenuItem>	
                        })
                    }
                    </Select>
                </div>
                <div className='leaderboard-panel-header'>
                    <div>Wallet</div>
                    <div>Wins</div>
                    <div>Losses</div>
                    <div>Ties</div>
                    <div>Total Wagered</div>
                </div>
                <div className='leaderboard-panel-body'>
                    <ul className='list-group list-group-flush'>
                    {
                        isLeaderboardLoading ?
                            <InfoComponent words="Loading..."/>
                        :
                            leaders.length===0 ?
                                <InfoComponent words="No Data"></InfoComponent>
                            :
                                leaders.map((item,idx)=>{
                                    
                                    return <LeaderboardComponent currency={currency}  key={idx} data={item}></LeaderboardComponent>
                                })
                    }
                    </ul>
                </div>
            </div>
        </div>
        <DarkModeButton/>
		<Footer/>
    </>
}