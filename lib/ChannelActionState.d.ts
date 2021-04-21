import { CCBLContextStateAny } from "./ContextState";
import { CCBLConstraintValue } from "./ConstraintValue";
import { ChannelAction } from "./ChannelAction";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { ChannelActionStateInterface } from "./ChannelActionStateEventInterface";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { ChannelInterface, ChannelJSON } from "./ChannelInterface";
import { CB_CCBLEmitter } from "./Emitter";
import { CCBLEmitterValue } from "./EmitterValue";
export declare type ChannelActionStateJSON = {
    available: boolean;
    type: string;
    channel: ChannelJSON;
    valueGetter: {
        type: string;
    };
    overhideValue: any;
};
export declare type FCT_ACTION<T> = (value: T) => void;
export declare class ChannelActionState<T> extends ChannelAction<T> implements ChannelActionStateInterface {
    channel: ChannelInterface<T>;
    private env;
    protected lastJSON: ChannelActionStateJSON | undefined;
    protected overrideValueGetter: CCBLExpressionInExecutionEnvironment<T> | undefined;
    protected valueGetter: CCBLExpressionInExecutionEnvironment<T> | CCBLConstraintValue<T>;
    protected isOverridedVG: CCBLEmitterValue<string | undefined>;
    constructor(channel: ChannelInterface<T>, env: CCBLEnvironmentExecutionInterface, value: string | CCBLExpressionInExecutionEnvironment<T> | CCBLConstraintValue<T>);
    dispose(): void;
    isOverrided(): boolean;
    getOverrideExpression(): string | undefined;
    onOverride(cb: CB_CCBLEmitter<string | undefined>): this;
    offOverride(cb: CB_CCBLEmitter<string | undefined>): this;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    toJSON(): ChannelActionStateJSON;
    isAvailable(): boolean;
    applyTo(V: T): T;
    overrideWith(expression: string): this;
    getValueGetter(): CCBLExpressionInExecutionEnvironment<T> | CCBLConstraintValue<T>;
    isValueGetterAConstraint(): boolean;
    isChannelActionState(): boolean;
    isChannelActionEvent(): boolean;
    attachTo(context: CCBLContextStateAny): this;
    activate(value?: boolean): this;
}
export declare function initChannelActionState(): void;
