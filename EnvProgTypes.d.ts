import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLEvent } from "./Event";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
export declare type InOutDescr = {
    type: string;
    name: string;
    typeValues?: any[];
    valueEmitter: CCBLEmitterValueInterface<any>;
};
export declare type EventDescr = {
    type: string;
    name: string;
    typeValues?: any[];
    ccblEvent: CCBLEvent<any>;
};
export declare type EnvDescr = {
    EE: CCBLEnvironmentExecution;
    events: EventDescr[];
    inputs: InOutDescr[];
    outputs: InOutDescr[];
};
