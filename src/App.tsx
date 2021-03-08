import React, {useState} from "react";
import { MainNavbar } from "./Components/Navbar/Navbar";
import { Footer } from './Components/Footer/Footer';
import { MineField } from "./Pages/MineField/MineField";
import { Statistic } from "./Models/Statistic";
import { LocalStorageValues, AppSettings, GameDifficultyEnum, GameFieldColorEnum, GameFlagTypeEnum } from "./AppConstants";
import { StatisticModal } from './Components/StatisticModal/StatiscticModal';
import { SettingsModal } from "./Components/SettingsModal/SettingsModal";
import useSound from "use-sound";
import music from "./Assets/sounds/Rezolution.mp3"
import sound from "./Assets/sounds/Click.mp3"

export function App() {

    const currentDifficulty: GameDifficultyEnum = localStorage[LocalStorageValues.DIFFICULTY];
    const currentFieldColor: GameFieldColorEnum = localStorage[LocalStorageValues.FIELD_COLOR];
    const currentFlagType: GameFlagTypeEnum = localStorage[LocalStorageValues.FLAG_TYPE];
    const currentSoundValue: string = localStorage[LocalStorageValues.SOUND];
    const currentMusicValue: string = localStorage[LocalStorageValues.MUSIC];

    const [statsOpen, setStatsOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [musicValue, setMusicValue] = useState(currentMusicValue ? Number(currentMusicValue): 0);
    const [soundValue, setSoundValue] = useState(currentSoundValue? Number(currentSoundValue): 50);
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
    const onMusicValueChange = (value: number) => {
        setMusicValue(value);
        localStorage[LocalStorageValues.MUSIC] = value;
        if(value <= 1){
            stopMusic();
        }
    };
    const onSoundValueChange = (value: number) => {
        setSoundValue(value);
        localStorage[LocalStorageValues.SOUND] = value;
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

    const [playMusic, { stop: stopMusic, isPlaying }] = useSound(
        music,
        { volume: musicValue / 100 }
    );
    const [playSound, { stop: stopSound, isPlaying: isPlayingSound }] = useSound(
        sound,
        { volume: soundValue / 100}
    );

    if(!isPlaying && (musicValue > 1)){
        playMusic();
    }
    const handleUseSound = () => {
        if(soundValue > 1){
            playSound();
        }
    }
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
                onUseSound={handleUseSound}
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
                musicValue={musicValue}
                soundValue={soundValue}
                onDifficultyChange={onDifficultyChange}
                onFieldColorChange={onColorChange}
                onFlagTypeChange={onFlagTypeChange}
                onMusicChange={onMusicValueChange}
                onSoundChange={onSoundValueChange}
            />
            <Footer/>
        </>
    );
}