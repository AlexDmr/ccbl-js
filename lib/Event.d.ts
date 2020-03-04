import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBL_EventJSON, CCBLEventInterface, CCBLEventValue, CB_CCBLEvent } from "./EventInterface";
import { CCBLEmitterValue } from "./EmitterValue";
export declare type CCBLEvent_config = {
    eventName: string;
    env: CCBLEnvironmentExecutionInterface;
    expressionFilter?: string;
    eventerSourceId?: string;
};
export declare class CCBLEvent<T> implements CCBLEventInterface<T> {
    eventName: string;
    jsonDirty: CCBLEmitterValue<boolean>;
    protected env: CCBLEnvironmentExecutionInterface;
    private available;
    private emitter;
    private lastJSON;
    private expreInEnv;
    private eventerSourceId;
    private eventerSource;
    private cbEventerSource;
    constructor({ eventName, expressionFilter, env, eventerSourceId }: CCBLEvent_config);
    dispose(): void;
    toJSON(): CCBL_EventJSON;
    getEventerSourceId(): string;
    getEventName(): string;
    getGuardExpression(): string;
    setGuardExpression(expr: string): this;
    onJsonDirty(cb: Function): () => void;
    offJsonDirty(actualCB: () => void): void;
    isAvailable(): boolean;
    setIsAvailable(available: boolean): this;
    on(cb: CB_CCBLEvent<T>): this;
    off(cb: CB_CCBLEvent<T>): this;
    trigger(evt: CCBLEventValue<T>): this;
}
export declare function initEvent(): void;
