import React from 'react';
import { CellValueEnum, GameFieldColorEnum, GameFlagTypeEnum } from '../../../../AppConstants';
import styles from  "./FieldCell.module.scss"
import { faBomb, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface FieldCellProps {
    type: CellValueEnum;
    hasFreeFlag: boolean;
    hasFlag: boolean;
    index:number;
    value?: number; 
    shouldBeOpened: boolean;
    isSelected?: boolean;
    fieldColor: GameFieldColorEnum;
    flagType: GameFlagTypeEnum;

    onOpen?: (index: number) => void;
    onFlag?: (index: number, isPut: boolean) => void;
}

interface FieldCellState {
}

export class FieldCell extends React.PureComponent<FieldCellProps, FieldCellState>{

    constructor(props: FieldCellProps){
        super(props);
    }

    private openField(){
        const {onOpen, index} = this.props;
        if(onOpen){
            onOpen(index)
        }
    }

    private flagField(){
        const {onFlag, index, hasFreeFlag, hasFlag} = this.props;
        if(!hasFreeFlag && !hasFlag)
            return;
        if(onFlag){
            onFlag(index, !hasFlag)
        }
    }

    private _handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        if(this.props.shouldBeOpened)
            return;
        if(event.button === 0){
            this.openField();
        }else if(event.button === 2){
            this.flagField();
        }        
    }

    private getClassByFieldColor(fieldColor: GameFieldColorEnum, shouldBeOpened: boolean): string{
        switch(fieldColor){
            case GameFieldColorEnum.Blue:
                return shouldBeOpened ? styles.blueOpened : styles.blueClosed;
            case GameFieldColorEnum.Red:
                return shouldBeOpened ? styles.redOpened : styles.redClosed;
            case GameFieldColorEnum.Yellow:
                return shouldBeOpened ? styles.yellowOpened : styles.yellowClosed;
            case GameFieldColorEnum.Purple:
                return shouldBeOpened ? styles.purpleOpened : styles.purpleClosed;
            case GameFieldColorEnum.Green:
                return shouldBeOpened ? styles.greenOpened : styles.greenClosed;
            default:
                return shouldBeOpened ? styles.blueOpened : styles.blueClosed;
        }
    }

    render(){
        const {type, value, hasFlag, isSelected, shouldBeOpened, fieldColor, flagType } = this.props;
        const fieldColorClass = this.getClassByFieldColor(fieldColor, shouldBeOpened);
        return (
            <>
                <div className={`${styles.cell} ${fieldColorClass} ${isSelected ? styles.rainbow: null}`}
                    onContextMenu={this._handleClick}
                    onClick={this._handleClick}
                >
                    <span className={styles.text}>
                        {hasFlag && !shouldBeOpened ? (flagType === GameFlagTypeEnum.Letter ? 'F' : <FontAwesomeIcon icon={faFlag}/>) : null}
                        {shouldBeOpened ? type == CellValueEnum.Bomb ? <FontAwesomeIcon icon={faBomb}/> : value ? value : null : null}
                    </span>
                </div>
            </>
        );
    }
}