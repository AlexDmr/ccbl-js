import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValue } from "./EmitterValue";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEmitterValueInterface, CCBLEmitterValueJSON } from "./EmitterValueInterface";
export declare class CCBLExpressionInExecutionEnvironment<T> extends CCBLEmitterValue<T> {
    protected env: CCBLEnvironmentExecutionInterface;
    private _originalExpression;
    private variableNames;
    private listening;
    private exprRootNode;
    private exprInterpolation;
    private channelsToCheck;
    private emitersToCheck;
    private cbEmitterUpdated;
    private errorEvaluation;
    constructor(config: CCBLExpressionInExecutionEnvironmentConfig);
    dispose(): void;
    toJSON(): CCBLExpressionInExecutionEnvironmentJSON;
    getErrorEvaluation(): undefined | string;
    readonly originalExpression: string;
    getExpression(): string;
    setExpression(expression: string, scope?: string[]): string;
    listen(value?: boolean): this;
    isAvailable(): boolean;
    isListening(): boolean;
    on(cb: (value: T) => void): this;
    off(cb: (value: T) => void): this;
    instanciate(scope?: {
        [key: string]: any;
    }): string;
    forceEvaluationOnce(addedScope?: {
        [key: string]: any;
    }, logError?: boolean): T;
    getAllDependencies(): CCBLEmitterValueInterface<any>[];
    getChannelDependencies(): ChannelInterface<any>[];
    protected getScope(scope?: {}): {
        [key: string]: any;
    };
    protected evaluateExpression(): void;
}
export declare type CCBLExpressionInExecutionEnvironmentConfig = {
    env: CCBLEnvironmentExecutionInterface;
    expression: string;
    addedScope?: string[];
};
export declare type CCBLExpressionInExecutionEnvironmentJSON = CCBLEmitterValueJSON & {
    expression: string;
    originalExpression: string;
};
