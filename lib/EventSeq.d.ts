import { CCBLEventValue } from "./EventInterface";
import { CCBLEvent } from "./Event";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
export declare class CCBLEventSeq<T> extends CCBLEvent<T> {
    env: CCBLEnvironmentExecution;
    private msDelay;
    private fctAND;
    private children;
    private lastEvents;
    constructor(eventName: string, env: CCBLEnvironmentExecution, msDelay: number, fctAND: (events: CCBLEventValue<any>[]) => CCBLEventValue<T>);
    dispose(): void;
    append(...eventNodes: CCBLEvent<any>[]): this;
    remove(...eventNodes: CCBLEvent<any>[]): this;
    getNbEventsRegistered(): number;
    private subscribeCB;
    private trimEvents;
}
