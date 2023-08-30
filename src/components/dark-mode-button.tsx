import { useState } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useTheme } from '../utils/useTheme';

export default function DarkModeButton(){
    const {inverse, isDark} = useTheme()
    const [isDarkMode, setIsDarkMode] = useState(isDark)

    const handleChange = (event : any) => {
        inverse()
        setIsDarkMode(event.target.checked)
    }

    return <div className={isDark ? "dark-mode-button dark-mode" : "dark-mode-button"}>
        <input type="checkbox" className="checkbox" id="checkbox" checked={isDarkMode} onChange={handleChange}/>
        <label htmlFor="checkbox" className="label">
            <LightModeIcon fontSize="small" sx={{color:"black"}}/>
            <DarkModeIcon fontSize="small" sx={{color:"white"}}/>
            <div className={isDarkMode ? 'ball trans-ball' : 'ball'}/>
        </label>
    </div>
}