export declare type CCBL_EventJSON = {
    available: boolean;
    type: "CCBL_EventJSON";
    eventName: string;
    expressionFilter?: string;
    eventerSourceId?: string;
};
export declare type CCBLEventValue<T> = {
    name?: string;
    value: T;
    ms?: number;
    source?: CCBLEventInterface<T>;
};
export declare type CB_CCBLEvent<T> = (event: CCBLEventValue<T>) => void;
export interface CCBLEventInterface<T> {
    onJsonDirty(cb: Function): this;
    toJSON(): CCBL_EventJSON;
    on(cb: CB_CCBLEvent<T>): this;
    off(cb: CB_CCBLEvent<T>): this;
    trigger(evt: CCBLEventValue<T>): this;
}
