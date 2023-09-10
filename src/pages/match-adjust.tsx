import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker, DatePicker } from '@mui/x-date-pickers';
import {
  TextField,
  MenuItem,
  Select,
  SelectChangeEvent,
  CircularProgress,
} from '@mui/material';

import { DarkModeButton, Menu, MessageAlert, Footer } from '@Components/index';
import { CATEGORIES, openNotification, POOL_DATA } from '@Utils/constant';
import { useProgram } from '@Utils/useProgram';
import { useTheme } from '@Utils/useTheme';

export default function MatchAdjust() {
  const { id } = useParams();
  const { isDark } = useTheme();
  const { updateGame, getGame } = useProgram();
  const { publicKey } = useWallet();

  const [value, setValue] = useState<Dayjs | null>(
    dayjs(new Date().toString()),
  );
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [isWaiting, setIsWaiting] = useState(false);

  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    getCurrentGame();
  }, []);

  const getCurrentGame = async () => {
    try {
      let address = new PublicKey(id!);
      let currentGame = await getGame(address);
      setTeamA(currentGame.team1);
      setTeamB(currentGame.team2);
      setCategory(CATEGORIES[currentGame.category].name);
      setValue(dayjs(new Date(currentGame.time * 1000).toString()));
      setGame(currentGame);
    } catch (err) {
      setGame(null);
    }
  };

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div
          className={
            isDark ? 'content text-center dark-mode' : 'content text-center'
          }
        >
          <MessageAlert />
          <Menu />
          <div className="create-match-panel">
            <h1>Update a Match</h1>
            <p>Update a Match using the panel below</p>
            {game == null || game.status !== 0 ? (
              <div className="allow-alert">Invalid Match</div>
            ) : publicKey == null ||
              POOL_DATA.owners.find(function (item) {
                return item.toBase58() === publicKey.toBase58();
              }) === undefined ? (
              <div className="allow-alert">You are not allowed.</div>
            ) : (
              <>
                <div className="match-properties">
                  <div className="team-name match-property">
                    <input
                      className="team-a input-team"
                      placeholder="Team A"
                      onChange={(event) => {
                        setTeamA(event.target.value);
                      }}
                      value={teamA}
                    />
                    <input
                      className="team-b input-team"
                      placeholder="Team B"
                      onChange={(event) => {
                        setTeamB(event.target.value);
                      }}
                      value={teamB}
                    />
                    <div className="vs-component">VS</div>
                  </div>
                  <div className="category match-property">
                    Category
                    <br />
                    <Select onChange={handleSelectChange} value={category}>
                      {CATEGORIES.map((item, idx) => {
                        return (
                          <MenuItem value={item.name} key={idx}>
                            <img
                              src={item.logo}
                              width="28px"
                              height="28px"
                              alt={item.name}
                            ></img>
                            &nbsp;{item.name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </div>
                  <div className="date-picker match-property">
                    Date
                    <br />
                    <DatePicker
                      inputFormat="YYYY-MM-DD"
                      value={value}
                      onChange={handleChange}
                      renderInput={(params: any) => <TextField {...params} />}
                    />
                  </div>
                  <div className="date-picker match-property">
                    Time
                    <br />
                    <TimePicker
                      value={value}
                      onChange={handleChange}
                      renderInput={(params: any) => <TextField {...params} />}
                    />
                  </div>
                </div>
                <button
                  className="create-match-btn"
                  disabled={isWaiting}
                  onClick={async () => {
                    setIsWaiting(true);
                    try {
                      let address = new PublicKey(id!);
                      if (teamA === '' || teamB === '') {
                        setIsWaiting(false);
                        openNotification(
                          'error',
                          'Please enter the correct team name',
                        );
                        return;
                      }
                      let cat = -1;
                      for (let i = 0; i < CATEGORIES.length; i++) {
                        if (CATEGORIES[i].name === category) {
                          cat = i;
                        }
                      }
                      if (cat === -1) throw new Error('category error');

                      await updateGame(
                        address,
                        cat,
                        teamA,
                        teamB,
                        value?.unix()!,
                      );
                      openNotification(
                        'success',
                        'Match Successfully Updated',
                        'The updated match will appear live shortly.',
                      );
                    } catch (err) {
                      openNotification('error', 'Something went wrong!');
                    }
                    setIsWaiting(false);
                  }}
                >
                  {isWaiting ? (
                    <CircularProgress color="inherit" disableShrink />
                  ) : (
                    'Update Match'
                  )}
                </button>
              </>
            )}
          </div>
        </div>
        <DarkModeButton />
        <Footer />
      </LocalizationProvider>
    </>
  );
}
