import React from 'react';
import styles from "./MineFiled.module.scss"
import { FieldCell } from './Components/FieldCell/FieldCell';
import { CellValueEnum, GameConditionEnum, MineSwiperField } from '../../AppConstants';
import { MineService } from './../../Services/MineService';
import { Button, Container, Tooltip } from 'reactstrap';
import { Timer } from './Components/Timer/Timer';
import { ModalDialog } from './Components/ModalDialog/ModalDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

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
    selectedIndex: number | null;
    tooltipOpen: boolean;
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
            beginTime: 0,
            selectedIndex: null,
            tooltipOpen: false
        };
    }

    componentDidMount(){
        this._resetGameState();
        document.addEventListener("keydown", this._handleKeyDown, false);
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this._handleKeyDown, false);
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

    _handleOpen = (index: number) => {       
        this.setState((state) => { 
                const isFailed = state.fieldValues[index] === MineSwiperField.BOMB_VALUE;
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

    _handleKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) {
            return; 
        }
        switch (event.key) {
            case "Down": // IE/Edge specific value
            case "ArrowDown":
                if(!this._startUsingOfKeyBoard()){
                    this._changeSelectedIndex(1, 0);
                }
              break;
            case "Up": // IE/Edge specific value
            case "ArrowUp":
                if(!this._startUsingOfKeyBoard()){
                    this._changeSelectedIndex(-1, 0);
                }
              break;
            case "Left": // IE/Edge specific value
            case "ArrowLeft":
                if(!this._startUsingOfKeyBoard()){
                    this._changeSelectedIndex(0, -1);                    
                }
              break;
            case "Right": // IE/Edge specific value
            case "ArrowRight":
                if(!this._startUsingOfKeyBoard()){
                    this._changeSelectedIndex(0, 1);
                }
            break;
            case "Esc": // IE/Edge specific value
            case "Escape":
                this.setState({
                    selectedIndex: null
                });
            break;
            case " ": 
                if(this.state.selectedIndex !== null){
                    this._handleOpen(this.state.selectedIndex);
                }
            break;
            default:
              return; 
          }
    }

    private _startUsingOfKeyBoard = () : boolean => {
        if(!this.state.selectedIndex === null){
            this.setState({
                selectedIndex: 0
            })
            return true;
        }
        return false;
    }
    
    private _changeSelectedIndex = (addToX: number, addToY: number) => {
        const {height, width} = this.props;
        const {selectedIndex} = this.state;
        const x = selectedIndex % width;
        const y = Math.floor(selectedIndex / width);
        let newIndexValue = selectedIndex;
        if(addToX){
            if(x + addToX >= width){
                newIndexValue = width * y;
            }else if(x + addToX < 0){
                newIndexValue = width * (y + 1) - 1
            }else{
                newIndexValue += addToX;
            }
        }
        if(addToY){
            if(y + addToY >= height){
                newIndexValue = x;
            }else if(y + addToY < 0){
                newIndexValue = width * (height - 1) + x
            }else{
                newIndexValue += addToY * height;
            }
        }
        this.setState({
            selectedIndex: newIndexValue
        });
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

    _toggleTooltip = () => {
        this.setState({
          tooltipOpen: !this.state.tooltipOpen
        });
    }

    renderField(){
        let resultTable: JSX.Element[] = [];
        const {width, height, bombCount} = this.props;
        const {fieldValues, flagsValues, fieldStatuses, selectedIndex} = this.state;
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
                        const type = item === 0 ? CellValueEnum.Empty :
                                     item === MineSwiperField.BOMB_VALUE ? CellValueEnum.Bomb : CellValueEnum.WithNumber; 
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
                            isSelected={realIndex === selectedIndex}
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
            <Container 
                onContextMenu={this._handleContextClick} 
            >
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
                    <div className={styles.question}>
                        <FontAwesomeIcon icon={faQuestionCircle}  id="question"/>
                        <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="question" toggle={this._toggleTooltip}>
                            You can use arrows to move.
                            Space for open.
                            Esc for exit manual mode.
                        </Tooltip>
                    </div>
                </div>
                <div 
                    className={styles.field}
                >
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