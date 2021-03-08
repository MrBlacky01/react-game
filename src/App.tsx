import React, {useState} from "react";
import { MainNavbar } from "./Components/Navbar/Navbar";
import { Footer } from './Components/Footer/Footer';
import { MineField } from "./Pages/MineField/MineField";
import { Statistic } from "./Models/Statistic";
import { LocalStorageValues, AppSettings, GameDifficultyEnum, GameFieldColorEnum, GameFlagTypeEnum } from "./AppConstants";
import { StatisticModal } from './Components/StatisticModal/StatiscticModal';
import { SettingsModal } from "./Components/SettingsModal/SettingsModal";

export function App() {

    const currentDifficulty: GameDifficultyEnum = localStorage[LocalStorageValues.DIFFICULTY];
    const currentFieldColor: GameFieldColorEnum = localStorage[LocalStorageValues.FIELD_COLOR];
    const currentFlagType: GameFlagTypeEnum = localStorage[LocalStorageValues.FLAG_TYPE];

    const [statsOpen, setStatsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [difficulty, setDifficulty] = useState(currentDifficulty ?? GameDifficultyEnum.Easy);
    const [color, setColor] = useState(currentFieldColor ?? GameFieldColorEnum.Blue);
    const [flagType, setFlagType] = useState(currentFlagType ?? GameFlagTypeEnum.Letter);

    const _handleWin = (stats: Statistic) =>{
        const currentStats: string = localStorage[LocalStorageValues.STATISTIC]
        const statsArray: Array<Statistic> = currentStats ? JSON.parse(currentStats) : [];
        if(statsArray.length == AppSettings.STATISTIC_COUNT){
            statsArray.splice(0, 1);
        }
        statsArray.push(stats);
        localStorage[LocalStorageValues.STATISTIC] = JSON.stringify(statsArray);
    }

    const toggleStats = () => setStatsOpen(!statsOpen);
    const openStats = () => setStatsOpen(true);
    const toggleSettings = () => setSettingsOpen(!settingsOpen);
    const openSettings = () => setSettingsOpen(true);

    const onDifficultyChange = (type: GameDifficultyEnum) => {
        setDifficulty(type);
        localStorage[LocalStorageValues.DIFFICULTY] = type;
    };
    const onColorChange = (color: GameFieldColorEnum) => {
        setColor(color);
        localStorage[LocalStorageValues.FIELD_COLOR] = color;
    };
    const onFlagTypeChange = (type: GameFlagTypeEnum) => {
        setFlagType(type);
        localStorage[LocalStorageValues.FLAG_TYPE] = type;
    };

    const getFieldWidthHeigth = (type: GameDifficultyEnum) => {
        switch(type){
            case GameDifficultyEnum.Hard:
                return 20;
            case GameDifficultyEnum.Medium:
                return 15;
            case GameDifficultyEnum.Easy:
            default: 
                return 10;
        }
    };

    return (
        <>
            <MainNavbar
                onStatsClick={openStats}
                onSettingsClick={openSettings}
            />
            <MineField 
                width={getFieldWidthHeigth(difficulty)} 
                height={getFieldWidthHeigth(difficulty)} 
                bombCount={getFieldWidthHeigth(difficulty) * 2}
                fieldColor={color}
                flagType={flagType}
                onWin={_handleWin}
            />
            <StatisticModal 
                isOpened={statsOpen}
                onClosed={toggleStats}
            />
            <SettingsModal
                isOpened={settingsOpen}
                onClosed={toggleSettings}
                difficulty={difficulty}
                fieldColor={color}
                flagType={flagType}
                onDifficultyChange={onDifficultyChange}
                onFieldColorChange={onColorChange}
                onFlagTypeChange={onFlagTypeChange}
            />
            <Footer/>
        </>
    );
}