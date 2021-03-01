import React from 'react';
import { Button } from 'reactstrap';
import { CellValueEnum } from '../../../../AppConstants';
import styles from  "./FieldCell.module.scss"

interface FieldCellProps {
    type: CellValueEnum;
    hasFreeFlag: boolean;
    index:number;
    value?: number; 

    onOpen?: (index: number, type: CellValueEnum) => void;
    onFlag?: (index: number, isPut: boolean) => void;
}

interface FieldCellState {
    isOpened: boolean;
    hasFlag: boolean;
}

export class FieldCell extends React.Component<FieldCellProps, FieldCellState>{

    constructor(props: FieldCellProps){
        super(props);
        this.state = {
            isOpened: false,
            hasFlag: false
        };
    }

    private openField(){
        this.setState({
            ...this.state,
            isOpened: true
        });
        const {onOpen, index, type} = this.props;
        if(onOpen){
            onOpen(index, type)
        }
    }

    private flagField(){
        const {onFlag, index, hasFreeFlag} = this.props;
        const {hasFlag} = this.state;
        if(!hasFreeFlag && !hasFlag)
            return;
        this.setState({
            ...this.state,
            hasFlag: !hasFlag
        }, () =>{
            if(onFlag){
                onFlag(index, this.state.hasFlag)
            }
        });
    }

    private _handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault();
        if(this.state.isOpened)
            return;
        if(event.button === 0){
            this.openField();
        }else if(event.button === 2){
            this.flagField();
        }        
    }

    render(){
        const {type, value} = this.props;
        const {isOpened, hasFlag} = this.state;
        return (
            <>
                <div className={`${styles.cell} ${isOpened ? styles.opened : styles.closed}`}
                    onContextMenu={this._handleClick}
                    onClick={this._handleClick}
                >
                    <span className={styles.text}>
                        {hasFlag && !isOpened ? 'F' : null}
                        {isOpened ? type == CellValueEnum.Bomb? 'B' : value : null}
                    </span>
                </div>
            </>
        );
    }
}