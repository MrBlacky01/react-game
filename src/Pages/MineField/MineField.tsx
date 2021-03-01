import React from 'react';
import styles from "./MineFiled.module.scss"
import { FieldCell } from './Components/FieldCell/FieldCell';
import { CellValueEnum, MineSwiper } from '../../AppConstants';
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
}

export class MineField extends React.Component<MineFieldProps, MineFieldState>{
    private mineService: MineService = null;

    constructor(props: MineFieldProps){
        super(props);
        this.mineService = new MineService();
        this.state = {
            fieldValues: [],
            flagCount: props.bombCount,
        };
    }

    componentDidMount(){
        const {width, bombCount, height} = this.props;
        this.setState({
            ...this.state,
            fieldValues: this.mineService.getFieldArray(width, height, bombCount)
        });
    }

    _handleContextClick(event: React.MouseEvent<HTMLElement, MouseEvent>){
        event.preventDefault();
    }

    _handleFlag = (index: number, isPut: boolean) => {
        this.setState({
            ...this.state,
            flagCount: isPut ? this.state.flagCount - 1: this.state.flagCount + 1,
        });
    }

    renderField(){
        let resultTable: JSX.Element[] = [];
        const {width, height} = this.props;
        const {fieldValues, flagCount} = this.state;
        for(var i = 0; i < height; i++){
            const beginLenght = i * width;
            const rowItems = fieldValues.slice(beginLenght, beginLenght + width);
            resultTable.push(
                <div key={"row" + i} className={styles.row}>
                    {rowItems.map( (item, index) => {
                        const type = item === 0 ? CellValueEnum.Empty : item === MineSwiper.BOMB_VALUE ? CellValueEnum.Bomb : CellValueEnum.WithNumber; 
                        return <FieldCell 
                            key={index + beginLenght} 
                            index={index + beginLenght} 
                            hasFreeFlag={flagCount > 0}
                            type={type} 
                            value={item} 
                            onFlag={this._handleFlag}
                        />
                    })}
                </div>
            )
        }
        return resultTable;
    }

    render(){
        const {flagCount} = this.state;
        return (
            <Container onContextMenu={this._handleContextClick}>
                Flags: {flagCount}
                {this.renderField()}
            </Container>
        );
    }
    //
}