export declare type CCBL_EventJSON = {
    available: boolean;
    type: "CCBL_EventJSON";
    eventName: string;
    eventExpression: string;
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
    dispose(): any;
    onJsonDirty(cb: Function): () => void;
    offJsonDirty(cb: Function): void;
    toJSON(): CCBL_EventJSON;
    on(cb: CB_CCBLEvent<T>): this;
    off(cb: CB_CCBLEvent<T>): this;
    trigger(evt: CCBLEventValue<T>): this;
    getEventName(): string;
    getEventerSourceId(): string | undefined;
    getGuardExpression(): string;
    getEventExpression(): string | undefined;
    evalEventExpression(): T | undefined;
}
