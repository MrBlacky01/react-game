export enum CellValueEnum {
    Bomb = 'Bomb',
    WithNumber = 'WithNumber',
    Empty = 'Empty'
}

export enum GameConditionEnum {
    Win = 'Win',
    Failed = 'Failed',
    InProgress = 'InProgress'
}

export class MineSwiperField{
    public static readonly BOMB_VALUE: number = 9;
    public static readonly EMPTY_VALUE: number = 0;
}