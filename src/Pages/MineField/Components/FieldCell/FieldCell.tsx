import React from 'react';
import { Button } from 'reactstrap';
import { CellValueEnum } from '../../../../AppConstants';
import styles from  "./FieldCell.module.scss"

interface FieldCellProps {
    type: CellValueEnum;
    hasFreeFlag: boolean;
    index:number;
    value?: number; 
    shouldBeOpened: boolean;

    onOpen?: (index: number, type: CellValueEnum, hasFlag: boolean) => void;
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

    componentDidUpdate(prevProps: FieldCellProps){
        if(this.props.shouldBeOpened !== prevProps.shouldBeOpened){
            this.setState({
                ...this.state,
                isOpened: this.props.shouldBeOpened
            })
        }
    }

    private openField(){
        const {onOpen, index, type, onFlag} = this.props;
        this.setState({
            ...this.state,
            isOpened: true,
            hasFlag: false
        });
        if(onOpen){
            onOpen(index, type, this.state.hasFlag)
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
        const {type, value, shouldBeOpened} = this.props;
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