import SHARK_IMG from '../assets/images/shark2.png'
import SOLNINO_LOGO from '../assets/images/logo-sm.png'
import { WalletMultiButton, } from '@solana/wallet-adapter-react-ui';
import TWITTER_IMG_Light from '../assets/images/twitter.png'
import { useWallet } from '@solana/wallet-adapter-react'
import TwitterLogin from 'react-twitter-login'

export default function ApplyPage(){
    const wallet = useWallet()
    const {publicKey} = useWallet()
        
    return <>
    <div className='apply-page text-center dark-mode'>
        <div className='header'>
            <div onClick={()=>{window.location.href="/"}}><img src={SOLNINO_LOGO} alt="LOGO" height="86px"></img></div>
            <div><WalletMultiButton/></div>
        </div>
        <div className='topic-part'>
			<div className='shark-image'>
				<img src={SHARK_IMG} alt="SHARK"></img>
			</div>
			<h1>Apply to</h1>
            <h1 className='special-part'>Get Drafted</h1>
			<p>The next wave is coming. Are you riding it?</p>
		</div>
        <div className='step-panel'>
            <div className='step-title'>STEP ONE</div>
            <div className='step-content'>Connect your wallet. A special treat will be sent to the wallet you apply with. This Wallet will be stored for future perks and rewards.</div>
            {
                publicKey==null ?
                    <WalletMultiButton style={{justifyContent : "center"}}/>
                :
                    <button className='btn-disconnect' onClick={()=>{wallet.disconnect()}}>Disconnect Wallet</button>
            }
        </div>
        <div className='step-panel'>
            <div className='step-title'>STEP TWO</div>
            <div className='step-content'>Connect your Twitter profile and follow the directions</div>
            <button className='step-button'>Connect to Twitter</button>
        </div>
        <button className='btn-apply'>Apply</button>
    </div>
    <div className='footer dark-footer'>
        <div><img src={SOLNINO_LOGO} alt="LOGO" height="45px"></img></div>
        <div><img className="twitter-link" src={TWITTER_IMG_Light} width="32px" alt="Twitter" onClick={()=>{
			window.location.href = "https://twitter.com/TheSolNino"
		}}></img></div>
    </div>
    </>
}