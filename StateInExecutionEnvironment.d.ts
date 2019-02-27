import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLEvent } from "./Event";
import { CCBLExpressionInExecutionEnvironment, CCBLExpressionInExecutionEnvironmentJSON } from "./CCBLExpressionInExecutionEnvironment";
export declare class CCBLEventStateInExecutionEnvironment extends CCBLEvent<boolean> {
    state: CCBLStateInExecutionEnvironment;
    constructor(state: CCBLStateInExecutionEnvironment, prefix: string, env: CCBLEnvironmentExecutionInterface);
}
export declare class CCBLStateInExecutionEnvironment extends CCBLExpressionInExecutionEnvironment<boolean> {
    jsonDirty: CCBLEmitterValue<boolean>;
    startEvent: CCBLEventStateInExecutionEnvironment;
    stopEvent: CCBLEventStateInExecutionEnvironment;
    private stateName;
    private lastJSON;
    private active;
    private emitterNewState;
    constructor(config: CCBLStateInExecutionEnvironmentConfig);
    isEvaluatedTrue(): boolean;
    getName(): string;
    toJSON(): CCBLStateInExecutionEnvironmentJSON;
    onChange(cb: CB_CCBLStateInExecutionEnvironmentChange): this;
    offChange(cb: CB_CCBLStateInExecutionEnvironmentChange): this;
}
export declare type CCBLStateInExecutionEnvironmentJSON = CCBLExpressionInExecutionEnvironmentJSON & {
    stateName: string;
    isActive: boolean;
};
export declare type CCBLStateInExecutionEnvironmentConfig = {
    env: CCBLEnvironmentExecutionInterface;
    expression: string;
    stateName: string;
};
export declare type CCBLStateInExecutionEnvironmentValue = {
    name?: string;
    value: boolean;
    ms?: number;
    source?: CCBLStateInExecutionEnvironment;
};
export declare type CB_CCBLStateInExecutionEnvironmentChange = (stateValue: CCBLStateInExecutionEnvironmentValue) => void;
