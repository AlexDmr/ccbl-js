import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
export declare type CCBLConstraintValueJSON = {
    type: string;
    expression;
};
export declare class CCBLConstraintValue<T> {
    private env;
    private expression;
    private exprInEnv;
    constructor(env: CCBLEnvironmentExecutionInterface, expression: string);
    apply(v: T): T;
    toJSON(): CCBLConstraintValueJSON;
}
