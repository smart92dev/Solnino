import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

import LOGO_IMG from '@Assets/images/logo.png';
import LOGO_IMG_DARK from '@Assets/images/logo-light.png';
import PROFILE_IMG from '@Assets/images/profile-icon.png';
import PROFILE_IMG_DARK from '@Assets/images/profile-icon-dark.png';
import PROFILE_IMG_VERIFIED from '@Assets/images/profile-icon-verified.png';
import PROFILE_IMG_DARK_VERIFIED from '@Assets/images/profile-icon-dark-verified.png';
import { useTheme } from '@Utils/useTheme';
import { useProgram } from '@Utils/useProgram';

export default function Menu() {
  const { isDark } = useTheme();
  const { publicKey } = useWallet();
  const { verified } = useProgram();

  return (
    <div className="header">
      <div
        className="logo-image"
        onClick={() => {
          window.location.href = '/';
        }}
      >
        <img
          src={isDark ? LOGO_IMG_DARK : LOGO_IMG}
          alt="LOGO"
          width="200px"
        ></img>
      </div>
      <div className="menu">
        <nav className="navbar navbar-expand-sm">
          <ul className="navbar-nav">
            {/* <li className='nav-item' onClick={()=>{window.location.href="/"}}>Active Bets</li> */}
            <li
              className="nav-item"
              onClick={() => {
                window.location.href = '/leaderboard';
              }}
            >
              Leaderboard
            </li>
            <li className="nav-item">
              <WalletMultiButton />
              {publicKey != null && (
                <img
                  className="profile-icon"
                  src={
                    isDark
                      ? verified
                        ? PROFILE_IMG_DARK_VERIFIED
                        : PROFILE_IMG_DARK
                      : verified
                      ? PROFILE_IMG_VERIFIED
                      : PROFILE_IMG
                  }
                  width="24px"
                  alt="profile"
                  onClick={() => {
                    window.location.href = '/#bet';
                  }}
                ></img>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
