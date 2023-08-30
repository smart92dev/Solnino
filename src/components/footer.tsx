import { useTheme } from "../utils/useTheme"
// import TWITTER_IMG from "../assets/images/twitter-icon.png"
import TWITTER_IMG_Light from '../assets/images/twitter.png'
export default function  Footer(){
	const {isDark} = useTheme()
	return <div className={isDark ? "footer dark-footer" :"footer"}>
		<div>SOLNino All Rights Reserved 2023</div>
	</div>
}