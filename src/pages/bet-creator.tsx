import { useState } from 'react';
import { DarkModeButton, Menu, MessageAlert, Footer } from '../components';
import dayjs, { Dayjs } from 'dayjs';
import {TextField, MenuItem, Select, SelectChangeEvent, CircularProgress} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import { useProgram } from '../utils/useProgram';
import { CATEGORIES, openNotification, POOL_DATA } from '../utils/constant';
import { useTheme } from '../utils/useTheme';
import { useWallet } from '@solana/wallet-adapter-react';

export default function BetCreator(){
    const {isDark} = useTheme()
    const {createGame} = useProgram()
    const {publicKey} = useWallet()

    const [value, setValue] = useState<Dayjs | null>(dayjs((new Date()).toString()),);
    const [teamA, setTeamA] = useState('')
    const [teamB, setTeamB] = useState('')
    const [category, setCategory] = useState(CATEGORIES[0].name)
    const [isWaiting, setIsWaiting] = useState(false)

    // const [isSuccess, setIsSuccess] = useState(false)

    const handleChange = (newValue: Dayjs | null) => {
        setValue(newValue);
    };

    const handleSelectChange = (event: SelectChangeEvent)=>{
        setCategory(event.target.value as string)
    }

    // const handleClose = () => {
    //     setIsSuccess(false)
    // }

    return <>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className={isDark ? "content text-center dark-mode" : "content text-center"}>
            <MessageAlert/>
            <Menu/>
            <div className='create-match-panel'>
                <h1>Create a Match</h1>
                <p>Create a Match using the panel below</p>
                {
                    publicKey==null || POOL_DATA.owners.find(function(item){return item.toBase58()===publicKey.toBase58()})===undefined ?
                        <div className='allow-alert'>You are not allowed.</div>
                    :
                        <>
                            <div className='match-properties'>
                                <div className='team-name match-property'>
                                    <input className='team-a input-team' placeholder='Team A' onChange={(event)=>{
                                        setTeamA(event.target.value)
                                    }} value={teamA}/>
                                    <input className='team-b input-team' placeholder='Team B' onChange={(event)=>{
                                        setTeamB(event.target.value)
                                    }} value={teamB}/>
                                    <div className='vs-component'>VS</div>
                                </div>
                                <div className='category match-property'>
                                    Category<br/>
                                    <Select onChange={handleSelectChange} value={category}>
                                    {
                                        CATEGORIES.map((item, idx)=>{
                                            return <MenuItem value={item.name} key={idx}><img src={item.logo} width="28px" height="28px" alt={item.name}></img>&nbsp;{item.name}</MenuItem>
                                        })
                                    }
                                    </Select>
                                </div>
                                <div className='date-picker match-property'>
                                    Date<br/>
                                    <DatePicker 
                                        inputFormat="YYYY-MM-DD"
                                        value={value} 
                                        onChange={handleChange} 
                                        renderInput={(params : any) => <TextField {...params} 
                                    />}/>
                                </div>
                                <div className='date-picker match-property'>
                                    Time<br/>
                                    <TimePicker 
                                        value={value} 
                                        onChange={handleChange} 
                                        renderInput={(params : any) => <TextField {...params} 
                                    />}/>
                                </div>
                            </div>
                            <button className='create-match-btn' disabled={isWaiting} onClick={async()=>{
                                setIsWaiting(true)
                                try{
                                    if(teamA==="" || teamB===""){
                                        setIsWaiting(false)
                                        openNotification('error', 'Please enter the correct team name')
                                        return;
                                    }
                                    let cat = -1;
                                    for(let i=0; i<CATEGORIES.length; i++){
                                        if(CATEGORIES[i].name===category){
                                            cat=i
                                        }
                                    }
                                    if(cat===-1) throw new Error("category error")
                                    await createGame(cat, teamA, teamB, value?.unix()!)
                                    openNotification('success','Match Successfully Created', 'The match will appear live shortly.')
                                }catch(err){
                                    openNotification('error','Something went wrong!')
                                }
                                setIsWaiting(false)
                            }}>
                            {
                                isWaiting ?
                                    <CircularProgress color="inherit" disableShrink/>
                                :
                                    "Create Match"
                            }</button>
                        </>
                }
            </div>
            {/* {
                isSuccess==true &&
                <Dialog fullWidth={true} maxWidth="md" onClose={handleClose} open={isSuccess}>
                    <div className='bet-modal-container'>

                    </div>
                </Dialog>
            } */}
        </div>
        <DarkModeButton/>
		<Footer/>
    </LocalizationProvider>
    </>
}