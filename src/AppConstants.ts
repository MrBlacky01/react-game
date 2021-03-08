export enum CellValueEnum {
    Bomb = 'Bomb',
    WithNumber = 'WithNumber',
    Empty = 'Empty'
}

export enum GameConditionEnum {
    Win = 'Win',
    Failed = 'Failed',
    InProgress = 'InProgress',
    New = 'New'
}

export enum GameDifficultyEnum {
    Easy = 'Easy',
    Medium = 'Medium',
    Hard = 'Hard'
}

export enum GameFieldColorEnum {
    Blue = 'blue',
    Red = 'red',
    Yellow = 'yellow',
    Purple = 'purple',
    Green = 'green',
}

export enum GameFlagTypeEnum {
    Letter = 'Letter',
    Icon = 'Icon',
}

export class MineSwiperField{
    public static readonly BOMB_VALUE: number = 9;
    public static readonly EMPTY_VALUE: number = 0;
}

export class LocalStorageValues{
    public static readonly GAME_STATUS: string = 'GAME_STATUS';
    public static readonly FIELD_STATUS: string = 'FIELD_STATUS';
    public static readonly FIELD_VALUES: string = 'FIELD_VALUES';
    public static readonly FLAG_VALUES: string = 'FLAG_VALUES';
    public static readonly TIMER_VALUE: string = 'TIMER_VALUE';
    public static readonly STATISTIC: string = 'STATISTIC';
    public static readonly FIELD_COLOR: string = 'FIELD_COLOR';
    public static readonly FLAG_TYPE: string = 'FLAG_TYPE';
    public static readonly DIFFICULTY: string = 'DIFFICULTY';
    public static readonly MUSIC: string = 'MUSIC';
    public static readonly SOUND: string = 'SOUND';
}

export class AppSettings {
    public static readonly STATISTIC_COUNT: number = 10;
}