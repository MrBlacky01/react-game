import {MineSwiperField} from "../AppConstants";

export class MineService{

    getFieldArray = (width: number, height: number, bombCount: number): number[] => {
        const length = width * height;
        let array = new Array(length).fill(0);
        let arrayOfIndex = Array.from({length}, (_, i) => i);
        for(let i = 0; i < bombCount; i++){
            const newItemIndex = this.getRandomIntFromRange(0, length - 1 - i);
            const index = arrayOfIndex[newItemIndex];
            array[index] = MineSwiperField.BOMB_VALUE;
            arrayOfIndex.splice(newItemIndex, 1);
        }
        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){
                const index = j + i * width;    
                if(array[index] == MineSwiperField.BOMB_VALUE)
                    continue;
                let aroundBombCount = 0;
                const neighBours = this.getNeighboursIndexes(j, i, width, height);
                neighBours.forEach(item => {
                    if(array[item] == MineSwiperField.BOMB_VALUE){
                        aroundBombCount ++;
                    }
                });
                array[index] = aroundBombCount;
            }
        }
        return array;
    }

    getEmptyArray = (length: number) => {
        return new Array(length).fill(false)
    }

    public getNeighboursIndexesByIndex = (index: number, width: number, height: number) => {
        const x = index % width;
        const y = Math.floor(index / width);
        return this.getNeighboursIndexes(x, y, width, height);
    }

    public getNeighboursIndexes = (x: number, y: number, width: number, height: number) => {
        let neighBours: Array<number> = [];
        this.putIntoNeighbourArray(neighBours,  x - 1, y - 1, width, height);
        this.putIntoNeighbourArray(neighBours,  x    , y - 1, width, height);
        this.putIntoNeighbourArray(neighBours,  x + 1, y - 1, width, height);
        this.putIntoNeighbourArray(neighBours,  x - 1, y    , width, height);
        this.putIntoNeighbourArray(neighBours,  x + 1, y    , width, height);
        this.putIntoNeighbourArray(neighBours,  x - 1, y + 1, width, height);
        this.putIntoNeighbourArray(neighBours,  x    , y + 1, width, height);
        this.putIntoNeighbourArray(neighBours,  x + 1, y + 1, width, height);
        return neighBours;
    }

    private putIntoNeighbourArray(array: Array<number>, x: number, y: number, width: number, height: number){
        if(this.isValidNeighbour(x, y, width, height)){
            array.push(x + y * width);
        }
    }
    private isValidNeighbour(x: number, y: number, width: number, height: number){
        return (x >= 0 && x < width && y >= 0 && y < height);
    }
    
    getRandomIntFromRange(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}