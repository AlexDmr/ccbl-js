import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
export declare type CCBLConstraintValueJSON = {
    type: string;
    expression: any;
};
export declare class CCBLConstraintValue<T> {
    private env;
    private expression;
    private exprInEnv;
    constructor(env: CCBLEnvironmentExecutionInterface, expression: string);
    dispose(): void;
    apply(v: T, scope?: {
        [key: string]: any;
    }): T;
    toJSON(): CCBLConstraintValueJSON;
}
export declare function initConstraintValue(): void;
