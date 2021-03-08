import React, {useCallback} from "react";
import { Button, ButtonGroup, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { GameDifficultyEnum, GameFieldColorEnum, GameFlagTypeEnum } from "../../AppConstants";
import styles from "./SettingsModal.module.scss"
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Slidrer } from "../../Components/Slider/Slider";

interface SettingsModalProps {
    isOpened: boolean;
    onClosed: () => void;
    difficulty: GameDifficultyEnum;
    fieldColor: GameFieldColorEnum;
    flagType: GameFlagTypeEnum;
    soundValue: number;
    musicValue: number;
    onDifficultyChange: (type: GameDifficultyEnum) => void;
    onFlagTypeChange: (tyep: GameFlagTypeEnum) => void;
    onFieldColorChange: (color: GameFieldColorEnum) => void;
    onMusicChange: (value: number) => void;
    onSoundChange: (value: number) => void;
};

export const SettingsModal: React.FC<SettingsModalProps> = (props: SettingsModalProps) => {
  
    const toggle = () => {
        if(props.onClosed){
            props.onClosed();
        }
    }
    const handleDifficultyClick = (type: GameDifficultyEnum) => {
        if(props.onDifficultyChange){
            props.onDifficultyChange(type);
        }
    };

    const handleColorClick = (color: GameFieldColorEnum) => {
        if(props.onFieldColorChange){
            props.onFieldColorChange(color);
        }
    };

    const handleFlagTypeClick = (type: GameFlagTypeEnum) => {
        if(props.onFlagTypeChange){
            props.onFlagTypeChange(type);
        }
    };
    const handleMusicChange = (value: number) => {
        if(props.onMusicChange){
            props.onMusicChange(value);
        }
    };
    const handleSoundChange = (value: number) => {
        if(props.onSoundChange){
            props.onSoundChange(value);
        }
    };
    const {fieldColor, difficulty, flagType, soundValue, musicValue} = props;

    return (
      <>
        <Modal isOpen={props.isOpened} toggle={toggle}>
            <ModalHeader toggle={toggle}>Settings</ModalHeader>
            <ModalBody>
                <>
                    <div>
                        <div>Music/Sound</div>
                        <div className={styles.fieldColorContent}>
                            <Slidrer value={musicValue}
                                onChange={handleMusicChange}
                            />
                            <Slidrer value={soundValue}
                                onChange={handleSoundChange}
                            />
                        </div>
                    </div>
                    <div>
                        <div>Difficulty</div>
                        <ButtonGroup className={styles.difficultyContent}>
                            <Button 
                                color={difficulty === GameDifficultyEnum.Easy ? "success" : "secondary"} 
                                onClick={() => handleDifficultyClick(GameDifficultyEnum.Easy)}
                            >
                                Easy
                            </Button>
                            <Button 
                                color={difficulty === GameDifficultyEnum.Medium ? "success" : "secondary"} 
                                onClick={() => handleDifficultyClick(GameDifficultyEnum.Medium)}
                            >
                                Medium
                            </Button>
                            <Button 
                                color={difficulty === GameDifficultyEnum.Hard ? "success" : "secondary"} 
                                onClick={() => handleDifficultyClick(GameDifficultyEnum.Hard)}
                            >
                                Hard
                            </Button>
                        </ButtonGroup>
                    </div>
                    <div>
                        <span>Field Color</span>
                        <div className={styles.fieldColorContent}>
                            <div 
                                className={`${styles.cell} ${styles.blue} ${fieldColor === GameFieldColorEnum.Blue ? styles.selected : null}`} 
                                onClick={() => handleColorClick(GameFieldColorEnum.Blue)}
                            />
                            <div 
                                className={`${styles.cell} ${styles.red} ${fieldColor === GameFieldColorEnum.Red ? styles.selected : null}`} 
                                onClick={() => handleColorClick(GameFieldColorEnum.Red)}
                            />
                            <div 
                                className={`${styles.cell} ${styles.yellow} ${fieldColor === GameFieldColorEnum.Yellow ? styles.selected : null}`} 
                                onClick={() => handleColorClick(GameFieldColorEnum.Yellow)}
                            />
                            <div 
                                className={`${styles.cell} ${styles.purple} ${fieldColor === GameFieldColorEnum.Purple ? styles.selected : null}`} 
                                onClick={() => handleColorClick(GameFieldColorEnum.Purple)}
                            />
                            <div 
                                className={`${styles.cell} ${styles.green} ${fieldColor === GameFieldColorEnum.Green ? styles.selected : null}`} 
                                onClick={() => handleColorClick(GameFieldColorEnum.Green)}
                            />
                        </div>
                    </div>
                    <div>
                        <span>Flag Type</span>
                        <div className={styles.fieldColorContent}>
                            <div 
                                className={`${styles.cell} ${flagType === GameFlagTypeEnum.Letter ? styles.selected : null}`} 
                                onClick={() => handleFlagTypeClick(GameFlagTypeEnum.Letter)}
                            >
                                <span className={styles.text}>F</span>
                            </div>
                            <div 
                                className={`${styles.cell} ${flagType === GameFlagTypeEnum.Icon ? styles.selected : null}`} 
                                onClick={() => handleFlagTypeClick(GameFlagTypeEnum.Icon)}
                            >
                                <FontAwesomeIcon className={styles.text} icon={faFlag}/>
                            </div>
                        </div>
                    </div>
                </>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={toggle}>Close</Button>
            </ModalFooter>
        </Modal>
      </>
    );
}