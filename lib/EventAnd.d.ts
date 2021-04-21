import { CCBLEventValue } from "./EventInterface";
import { CCBLEvent } from "./Event";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
export declare class CCBLEventAnd<T> extends CCBLEvent<T> {
    private msDelay;
    private fctAND;
    private children;
    private lastEvents;
    constructor(eventName: string | undefined, env: CCBLEnvironmentExecutionInterface, msDelay: number, fctAND: (events: CCBLEventValue<any>[]) => CCBLEventValue<T>);
    dispose(): void;
    append(...eventNodes: CCBLEvent<any>[]): this;
    remove(...eventNodes: CCBLEvent<any>[]): this;
    getNbEventsRegistered(): number;
    private subscribeCB;
    private trimEvents;
}
