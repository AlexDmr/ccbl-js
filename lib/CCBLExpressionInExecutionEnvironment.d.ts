import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValue } from "./EmitterValue";
import { MathJsStatic } from "mathjs";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEmitterValueInterface, CCBLEmitterValueJSON } from "./EmitterValueInterface";
export declare const scopeInterpolator: {
    [key: string]: (dt: number, v0: any, v1: any) => any;
};
export declare const mathjs: MathJsStatic;
export declare class CCBLExpressionInExecutionEnvironment<T> extends CCBLEmitterValue<T | undefined> {
    protected env: CCBLEnvironmentExecutionInterface;
    private _originalExpression;
    private _variableNames;
    private listening;
    private neverListenBefore;
    private exprRootNode;
    private exprInterpolation;
    private channelsToCheck;
    private emitersToCheck;
    private cbEmitterUpdated;
    private errorEvaluation;
    private nextUpdateTime;
    constructor(config: CCBLExpressionInExecutionEnvironmentConfig);
    dispose(): void;
    toJSON(): CCBLExpressionInExecutionEnvironmentJSON;
    getErrorEvaluation(): undefined | string;
    get originalExpression(): string;
    get variableNames(): string[];
    getExpression(): string | undefined;
    setExpression(expression: string, scope?: string[]): string;
    listen(value?: boolean): this;
    isAvailable(): boolean;
    isListening(): boolean;
    on(cb: (value: T | undefined) => void): this;
    off(cb: (value: T | undefined) => void): this;
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
