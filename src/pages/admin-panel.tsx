import { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import CachedIcon from '@mui/icons-material/Cached';

import {
  DarkModeButton,
  Menu,
  MessageAlert,
  Footer,
  CurrentBetComponent,
} from '@Components/index';
import InfoComponent from '@Components/info';
import { POOL_DATA } from '@Utils/constant';
import { useProgram } from '@Utils/useProgram';
import { useTheme } from '@Utils/useTheme';

export default function AdminPanel() {
  const { isDark } = useTheme();
  const { games, isGameLoading, getGames } = useProgram();
  const { publicKey } = useWallet();

  useEffect(() => {
    getGames();
  }, []);

  return (
    <>
      <div
        className={
          isDark ? 'content text-center dark-mode' : 'content text-center'
        }
      >
        <MessageAlert />
        <Menu />
        <div className="create-match-panel">
          <h1>Admin Panel</h1>
          <p>Select the team that won each match.</p>
        </div>
        <div className="current-bet-panel">
          {publicKey != null &&
            POOL_DATA.owners.find(function (item) {
              return item.toBase58() === publicKey.toBase58();
            }) !== undefined && (
              <div className="current-bet-panel-header">
                <div></div>
                <div>Total Bets</div>
                <div>
                  <CachedIcon
                    fontSize="large"
                    sx={{ color: isDark ? 'white' : 'black' }}
                    onClick={() => {
                      getGames();
                    }}
                  />
                </div>
              </div>
            )}
          <div className="current-bet-panel-body">
            <ul className="list-group list-group-flush">
              {publicKey == null ||
              POOL_DATA.owners.find(function (item) {
                return item.toBase58() === publicKey.toBase58();
              }) === undefined ? (
                <InfoComponent words="You are not allowed"></InfoComponent>
              ) : isGameLoading ? (
                <InfoComponent words="Loading..."></InfoComponent>
              ) : games.find(function (item) {
                  return item.status === 0;
                }) === undefined ? (
                <InfoComponent words="No Games"></InfoComponent>
              ) : (
                games.map((item, idx) => {
                  if (item.status === 0)
                    return (
                      <CurrentBetComponent
                        key={idx}
                        data={item}
                      ></CurrentBetComponent>
                    );
                  else return <></>;
                })
              )}
            </ul>
          </div>
        </div>
      </div>
      <DarkModeButton />
      <Footer />
    </>
  );
}
