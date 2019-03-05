import { CCBLContextEvent } from "./ContextEvent";
import { ChannelAction } from "./ChannelAction";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { ChannelActionEventInterface } from "./ChannelActionStateEventInterface";
import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { ChannelInterface, ChannelJSON } from "./ChannelInterface";
export declare type ChannelActionEventJSON = {
    type: string;
    channel: ChannelJSON;
    expression: string;
};
export declare class ChannelActionEvent<T> extends ChannelAction<T> implements ChannelActionEventInterface {
    channel: ChannelInterface<T>;
    protected env: CCBLEnvironmentExecutionInterface;
    exprInEnv: CCBLExpressionInExecutionEnvironment<T>;
    contextEvent: CCBLContextEvent;
    protected triggerable: boolean;
    protected lastJSON: ChannelActionEventJSON;
    constructor(channel: ChannelInterface<T>, env: CCBLEnvironmentExecutionInterface, expression: string);
    dispose(): void;
    isChannelActionState(): boolean;
    isChannelActionEvent(): boolean;
    toJSON(): ChannelActionEventJSON;
    getContextEvent(): CCBLContextEvent;
    getValueGetter(): CCBLExpressionInExecutionEnvironment<T>;
    applyTo(V: T): T;
    attachTo(context: CCBLContextEvent): this;
    activate(value?: boolean): this;
}
export declare function initChannelActionEvent(): void;
