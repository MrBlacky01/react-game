import React from 'react';
import styles from "./MineFiled.module.scss"
import { FieldCell } from './Components/FieldCell/FieldCell';
import { CellValueEnum, GameConditionEnum, MineSwiperField } from '../../AppConstants';
import { MineService } from './../../Services/MineService';
import { Button, Container } from 'reactstrap';
import { Timer } from './Components/Timer/Timer';
import { ModalDialog } from './Components/ModalDialog/ModalDialog';

interface MineFieldProps {
    width: number;
    height: number;
    bombCount: number;
}

interface MineFieldState {
    fieldValues: Array<number>;
    flagsValues: Array<number>;
    fieldStatuses: Array<boolean>;
    condition: GameConditionEnum;
    currentTime: number;
    beginTime: number;
}

export class MineField extends React.Component<MineFieldProps, MineFieldState>{
    private mineService: MineService = null;
    private bombIndexes: Array<number> = [];

    constructor(props: MineFieldProps){
        super(props);
        this.mineService = new MineService();
        this.state = {
            fieldValues: [],
            flagsValues: [],
            fieldStatuses: [],
            condition: GameConditionEnum.New,
            currentTime: 0,
            beginTime: 0
        };
    }

    componentDidMount(){
        this._resetGameState();
    }

    _handleContextClick(event: React.MouseEvent<HTMLElement, MouseEvent>){
        event.preventDefault();
    }

    _handleNewGameClick = () => {
        this._resetGameState();
    }

    private _resetGameState = () =>{
        const {width, bombCount, height} = this.props;
        this.setState({
            fieldValues: this.mineService.getFieldArray(width, height, bombCount),
            fieldStatuses: this.mineService.getEmptyArray(width * height),
            condition: GameConditionEnum.New,
            currentTime: 0,
            beginTime: 0,
            flagsValues: [],
        }, () => {
            this.bombIndexes = [];
            this.state.fieldValues.forEach( (x, index) => {
                if(x === MineSwiperField.BOMB_VALUE){
                    this.bombIndexes.push(index);
                }
            });
        });
    }

    _handleFlag = (index: number, isPut: boolean) => {
        const {flagsValues} = this.state;
        if(isPut){
            flagsValues.push(index);
        }else{
            const flagValueIndex = flagsValues.findIndex(x => x === index);
            if(flagValueIndex >= 0){
                flagsValues.splice(flagValueIndex, 1)
            }
        }
        this.setState({
            ...this.state,
            flagsValues: flagsValues,
        });
    }

    _handleOpen = (index: number, type: CellValueEnum) => {       
        this.setState((state) => { 
                const isFailed = type === CellValueEnum.Bomb;
                return {
                    condition: isFailed ? GameConditionEnum.Failed: state.condition
                }
            }, () => {
            this._openCell(index);
        });
    }

    _handleTick = (time: number) =>{
        this.setState({currentTime: time});
    }

    private _openCell = (index: number) => {
        const {fieldValues, fieldStatuses, condition, flagsValues} = this.state;
        if(fieldStatuses[index])
            return;
        const isEmpty = fieldValues[index] == MineSwiperField.EMPTY_VALUE;
        fieldStatuses[index] = true;
        const isWin = this._isGameFinished();
        const isInProgres = condition === GameConditionEnum.New ? GameConditionEnum.InProgress : condition;
        const flagValueIndex = flagsValues.findIndex(x => x === index);
        if(flagValueIndex >= 0){
            flagsValues.splice(flagValueIndex, 1)
        }
        this.setState({
            fieldStatuses: fieldStatuses,
            condition: isWin ? GameConditionEnum.Win: isInProgres,
            flagsValues: flagsValues
        }, () => {
            if(isEmpty){
                const neighbours = this.mineService.getNeighboursIndexesByIndex(index, this.props.width, this.props.height);
                setTimeout(() => {
                    neighbours.forEach(x => {
                        this._openCell(x);
                    });
                });
                
            }
        })
    }

    private _isGameFinished = () =>{
        return !this.state.fieldStatuses.some( (item, index) => {
            return (this.bombIndexes.findIndex(x => x === index) === -1) && !item;
        });
    }

    renderField(){
        let resultTable: JSX.Element[] = [];
        const {width, height, bombCount} = this.props;
        const {fieldValues, flagsValues, fieldStatuses} = this.state;
        const hasFreeFlags = flagsValues.length < bombCount;
        for(var i = 0; i < height; i++){
            const beginLenght = i * width;
            const rowItems = fieldValues.slice(beginLenght, beginLenght + width);
            resultTable.push(
                <div key={"row" + i}>
                    {rowItems.map( (item, index) => {
                        const realIndex = beginLenght + index;
                        const isOpen = fieldStatuses[realIndex];
                        const hasFlag = flagsValues.some(x => x === realIndex);
                        const type = item === 0 ? CellValueEnum.Empty : item === MineSwiperField.BOMB_VALUE ? CellValueEnum.Bomb : CellValueEnum.WithNumber; 
                        return <FieldCell 
                            key={index + beginLenght} 
                            index={index + beginLenght} 
                            hasFreeFlag={hasFreeFlags}
                            hasFlag={hasFlag}
                            type={type} 
                            value={item} 
                            shouldBeOpened={isOpen}
                            onFlag={this._handleFlag}
                            onOpen={this._handleOpen}

                        />
                    })}
                </div>
            )
        }
        return resultTable;
    }

    render(){
        const {flagsValues, condition, beginTime } = this.state;
        const {bombCount} = this.props;
        return (
            <Container onContextMenu={this._handleContextClick}>
                <div className={styles.stats}>
                    <span className={styles.flags}>Flags: {bombCount - flagsValues.length}</span>              
                    <Button color="primary" onClick={this._handleNewGameClick}>New Game</Button>
                    <div className={styles.score}>
                        <span>Score:  </span>  
                        <Timer 
                            timeStart={beginTime}
                            shouldStart={condition === GameConditionEnum.InProgress}
                            shouldFinish={condition !== GameConditionEnum.InProgress}
                            onTick={this._handleTick}
                        />
                    </div>
                </div>
                <div className={styles.field}>
                    {this.renderField()}
                </div>
                {condition === GameConditionEnum.Win &&
                    <ModalDialog
                        title="Congradulations"
                        body={`You win. Your score is ${this.state.currentTime}`}
                        onClick={this._handleNewGameClick}
                    />
                }
                {condition === GameConditionEnum.Failed &&
                    <ModalDialog
                        title="Ooops :("
                        body="You loose. Try once again."
                        onClick={this._handleNewGameClick}
                    />
                }
            </Container>
        );
    }
    //
}