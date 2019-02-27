import { CCBLContextStateAny } from "./ContextState";
import { CCBLConstraintValue } from "./ConstraintValue";
import { ChannelAction } from "./ChannelAction";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { ChannelActionStateInterface } from "./ChannelActionStateEventInterface";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { ChannelInterface, ChannelJSON } from "./ChannelInterface";
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
    protected lastJSON: ChannelActionStateJSON;
    protected overhideValueGetter: CCBLExpressionInExecutionEnvironment<T>;
    protected valueGetter: CCBLExpressionInExecutionEnvironment<T> | CCBLConstraintValue<T>;
    constructor(channel: ChannelInterface<T>, env: CCBLEnvironmentExecutionInterface, value: string | CCBLExpressionInExecutionEnvironment<T> | CCBLConstraintValue<T>);
    dispose(): void;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    toJSON(): ChannelActionStateJSON;
    isAvailable(): boolean;
    applyTo(V: T): T;
    overhideWith(expression: string): this;
    getValueGetter(): CCBLExpressionInExecutionEnvironment<T> | CCBLConstraintValue<T>;
    isValueGetterAConstraint(): boolean;
    isChannelActionState(): boolean;
    isChannelActionEvent(): boolean;
    attachTo(context: CCBLContextStateAny): this;
    activate(value?: boolean): this;
}
