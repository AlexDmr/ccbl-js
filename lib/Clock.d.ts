import { CCBLEmitterValue } from "./EmitterValue";
export interface CCBLClock {
    now(): number;
    emitChange(ms?: number): this;
    onChange(cb: (ms: number) => void, end?: boolean): this;
    offChange(cb: (ms: number) => void): this;
    registerTimeForUpdate(ms: number): this;
}
export declare type CB_Clock = (ms: number) => void;
export declare abstract class CCBLAbstractClock extends CCBLEmitterValue<number> implements CCBLClock {
    protected timesForUpdate: number[];
    protected endEmitter: CCBLEmitterValue<number>;
    constructor();
    now(): number;
    emitChange(ms?: number): this;
    onChange(cb: (ms: number) => void, end?: boolean): this;
    offChange(cb: CB_Clock): this;
    registerTimeForUpdate(ms: number): this;
    get nextForeseenUpdate(): number;
}
export declare class CCBLSystemClock extends CCBLAbstractClock {
    now(): number;
}
export declare class CCBLTestClock extends CCBLAbstractClock {
    ms: number;
    now(): number;
    forward(ms?: number): this;
    goto(ms: number): this;
}
