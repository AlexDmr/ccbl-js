import { CCBLEventValue } from "./EventInterface";
import { CCBLEvent } from "./Event";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
export declare class CCBLEventOr<T> extends CCBLEvent<T> {
    env: CCBLEnvironmentExecutionInterface;
    private fctOR;
    private children;
    constructor(eventName: string, env: CCBLEnvironmentExecutionInterface, fctOR: (e: CCBLEventValue<any>) => CCBLEventValue<T>);
    append(...eventNodes: CCBLEvent<any>[]): this;
    remove(...eventNodes: CCBLEvent<any>[]): this;
    private subscribeCB;
}
