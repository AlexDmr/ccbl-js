import { CCBLEmitterValue } from "./EmitterValue";
export interface CCBLClock {
    now(): number;
    emitChange(ms?: number): this;
    onChange(cb: CB_Clock, end?: boolean): this;
    offChange(cb: CB_Clock): this;
    registerTimeForUpdate(ms: number): this;
    unregisterTimeForUpdate(ms: number): this;
}
export declare type CB_Clock = (ms: number | undefined) => void;
export declare abstract class CCBLAbstractClock extends CCBLEmitterValue<number | undefined> implements CCBLClock {
    protected timesForUpdate: number[];
    protected endEmitter: CCBLEmitterValue<number | undefined>;
    constructor();
    abstract now(): number;
    emitChange(ms?: number): this;
    onChange(cb: CB_Clock, end?: boolean): this;
    offChange(cb: CB_Clock): this;
    registerTimeForUpdate(ms: number): this;
    unregisterTimeForUpdate(ms: number): this;
    getTimesForUpdate(): number[];
    get nextForeseenUpdate(): number | undefined;
}
export declare class CCBLSystemClock extends CCBLAbstractClock {
    now(): number;
}
export declare class CCBLTestClock extends CCBLAbstractClock {
    ms: number;
    now(): number;
    forward(ms?: number): this;
    goto(ms: number): this;
    set(ms: number): this;
}
