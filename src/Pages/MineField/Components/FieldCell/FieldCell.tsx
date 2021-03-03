import React from 'react';
import { CellValueEnum } from '../../../../AppConstants';
import styles from  "./FieldCell.module.scss"

interface FieldCellProps {
    type: CellValueEnum;
    hasFreeFlag: boolean;
    hasFlag: boolean;
    index:number;
    value?: number; 
    shouldBeOpened: boolean;

    onOpen?: (index: number, type: CellValueEnum) => void;
    onFlag?: (index: number, isPut: boolean) => void;
}

interface FieldCellState {
    isOpened: boolean;
}

export class FieldCell extends React.PureComponent<FieldCellProps, FieldCellState>{

    constructor(props: FieldCellProps){
        super(props);
        this.state = {
            isOpened: false
        };
    }

    componentDidUpdate(prevProps: FieldCellProps){
        if(this.props.shouldBeOpened !== prevProps.shouldBeOpened){
            this.setState({
                isOpened: this.props.shouldBeOpened,
            })
        }
    }

    private openField(){
        const {onOpen, index, type} = this.props;
        this.setState({
            ...this.state,
            isOpened: true,
        });
        if(onOpen){
            onOpen(index, type)
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
        if(this.state.isOpened)
            return;
        if(event.button === 0){
            this.openField();
        }else if(event.button === 2){
            this.flagField();
        }        
    }

    render(){
        const {type, value, hasFlag } = this.props;
        const {isOpened} = this.state;
        return (
            <>
                <div className={`${styles.cell} ${isOpened ? styles.opened : styles.closed}`}
                    onContextMenu={this._handleClick}
                    onClick={this._handleClick}
                >
                    <span className={styles.text}>
                        {hasFlag && !isOpened ? 'F' : null}
                        {isOpened ? type == CellValueEnum.Bomb? 'B' : value ? value : null : null}
                    </span>
                </div>
            </>
        );
    }
}