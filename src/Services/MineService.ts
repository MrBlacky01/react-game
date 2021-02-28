import {MineSwiper} from "../AppConstants";

export class MineService{

    getFieldArray = (width: number, height: number, bombCount: number): number[] => {
        const length = width * height;
        let array = new Array(length).fill(0);
        let arrayOfIndex = Array.from({length}, (_, i) => i);
        for(let i = 0; i < bombCount; i++){
            const newItemIndex = this.getRandomIntFromRange(0, length - 1 - i);
            const index = arrayOfIndex[newItemIndex];
            array[index] = MineSwiper.BOMB_VALUE;
            arrayOfIndex.splice(newItemIndex, 1);
        }
        for(let i = 0; i < height; i++){
            for(let j = 0; j < width; j++){
                const index = j + i * width;    
                if(array[index] == MineSwiper.BOMB_VALUE)
                    continue;
                let aroundBombCount = 0;
                aroundBombCount += this.hasBomb(array, j - 1, i - 1, width, height);
                aroundBombCount += this.hasBomb(array, j    , i - 1, width, height);
                aroundBombCount += this.hasBomb(array, j + 1, i - 1, width, height);
                aroundBombCount += this.hasBomb(array, j - 1, i    , width, height);
                aroundBombCount += this.hasBomb(array, j + 1, i    , width, height);
                aroundBombCount += this.hasBomb(array, j - 1, i + 1, width, height);
                aroundBombCount += this.hasBomb(array, j    , i + 1, width, height);
                aroundBombCount += this.hasBomb(array, j + 1, i + 1, width, height);
                array[index] = aroundBombCount;
            }
        }
        return array;
    }

    private hasBomb(array: Array<number>, x: number, y: number, width: number, height: number){
        if(x < 0 || x == width || y < 0 || y == height)
            return 0;
        return array[x + y * width] == MineSwiper.BOMB_VALUE ? 1 : 0; 
    }

    
    getRandomIntFromRange(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}