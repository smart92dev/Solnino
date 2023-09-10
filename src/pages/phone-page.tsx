import SHARK_IMG from '@Assets/images/shark.png';
import SOLNINO_LOGO from '@Assets/images/logo-light.png';
import SOL_IMG from '@Assets/images/sol-icon.png';
import TWITTER_IMG from '@Assets/images/twitter-icon.png';

export default function PhonePage() {
  return (
    <div className="phone-page">
      <div className="top-part">
        <div className="header">
          <div className="logo-link">
            <img src={SOLNINO_LOGO} alt="SOLNino" />
          </div>
          <div className="twitter-link">
            <img src={TWITTER_IMG} alt="Twitter" onClick={() => {}} />
          </div>
        </div>
        <div className="topic-part">
          <div className="shark-image">
            <img src={SHARK_IMG} width="400px" alt="SHARK"></img>
          </div>
          <h1>
            P2P Sports
            <br />
            betting is here.
          </h1>
          <p>
            For the best user experience
            <br />
            visit <b>SOL</b>Nino on your
            <br />
            desktop or tablet
          </p>
        </div>
      </div>
      <div className="below-part">
        POWERED BY&nbsp;
        <img src={SOL_IMG} height="20px" alt="SOL" />
      </div>
    </div>
  );
}
