import React from 'react';
import styles from "./MineFiled.module.scss"
import { FieldCell } from './Components/FieldCell/FieldCell';
import { CellValueEnum, GameConditionEnum, MineSwiperField } from '../../AppConstants';
import { MineService } from './../../Services/MineService';
import { Container } from 'reactstrap';

interface MineFieldProps {
    width: number;
    height: number;
    bombCount: number;
}

interface MineFieldState {
    fieldValues: Array<number>;
    flagCount: number;
    fieldStatuses: Array<boolean>;
    condition: GameConditionEnum
}

export class MineField extends React.Component<MineFieldProps, MineFieldState>{
    private mineService: MineService = null;
    private bombIndexes: Array<number> = [];

    constructor(props: MineFieldProps){
        super(props);
        this.mineService = new MineService();
        this.state = {
            fieldValues: [],
            flagCount: props.bombCount,
            fieldStatuses: [],
            condition: GameConditionEnum.InProgress
        };
    }

    componentDidMount(){
        const {width, bombCount, height} = this.props;
        this.setState({
            ...this.state,
            fieldValues: this.mineService.getFieldArray(width, height, bombCount),
            fieldStatuses: this.mineService.getEmptyArray(width * height),
        }, () => {
            this.bombIndexes = [];
            this.state.fieldValues.forEach( (x, index) => {
                if(x === MineSwiperField.BOMB_VALUE){
                    this.bombIndexes.push(index);
                }
            });
        });
    }

    _handleContextClick(event: React.MouseEvent<HTMLElement, MouseEvent>){
        event.preventDefault();
    }

    _handleFlag = (index: number, isPut: boolean) => {
        const {flagCount} = this.state;
        const newFlagCount = isPut ? flagCount - 1: flagCount + 1
        this.setState({
            ...this.state,
            flagCount: newFlagCount,
        });
    }

    _handleOpen = (index: number, type: CellValueEnum, hasFlag: boolean) => {
        const { condition, flagCount} = this.state;
        const isFailed = type === CellValueEnum.Bomb;
        this.setState({
            ...this.state,
            condition: isFailed ? GameConditionEnum.Failed: condition,
            flagCount: hasFlag ? flagCount + 1: flagCount
        }, () => {
            this._openCell(index);
        });
    }

    private _openCell = (index: number) => {
        const {fieldValues, fieldStatuses, condition} = this.state;
        if(fieldStatuses[index])
            return;
        const isEmpty = fieldValues[index] == MineSwiperField.EMPTY_VALUE;
        fieldStatuses[index] = true;
        const isWin = this._isGameFinished();
        this.setState({
            ...this.state,
            fieldStatuses: fieldStatuses,
            condition: isWin ? GameConditionEnum.Win: condition,
        }, () => {
            if(isEmpty){
                const neighbours = this.mineService.getNeighboursIndexesByIndex(index, this.props.width, this.props.height);
                neighbours.forEach(x => {
                    this._openCell(x);
                })
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
        const {width, height} = this.props;
        const {fieldValues, flagCount, fieldStatuses} = this.state;
        for(var i = 0; i < height; i++){
            const beginLenght = i * width;
            const rowItems = fieldValues.slice(beginLenght, beginLenght + width);
            resultTable.push(
                <div key={"row" + i} className={styles.row}>
                    {rowItems.map( (item, index) => {
                        const isOpen = fieldStatuses[beginLenght + index];
                        const type = item === 0 ? CellValueEnum.Empty : item === MineSwiperField.BOMB_VALUE ? CellValueEnum.Bomb : CellValueEnum.WithNumber; 
                        return <FieldCell 
                            key={index + beginLenght} 
                            index={index + beginLenght} 
                            hasFreeFlag={flagCount > 0}
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
        const {flagCount, condition} = this.state;
        return (
            <Container onContextMenu={this._handleContextClick}>
                Flags: {flagCount}
                Status: {condition}
                {this.renderField()}
            </Container>
        );
    }
    //
}