import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { CB_CCBLEmitter } from "./Emitter";
export interface ChannelActionInterface {
    readonly id: string;
    dispose(): any;
    getPriority(): number;
    getChannel(): ChannelInterface<any>;
    isChannelActionEvent(): boolean;
    isChannelActionState(): boolean;
    getIsActivated(): CCBLEmitterValueInterface<boolean>;
}
export interface ChannelActionEventInterface extends ChannelActionInterface {
    getValueGetter(): CCBLExpressionInExecutionEnvironment<any>;
    getContextEvent(): any;
}
export interface ChannelActionStateInterface extends ChannelActionInterface {
    getValueGetter(): any;
    isValueGetterAConstraint(): boolean;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    overrideWith(value: string): this;
    isOverrided(): boolean;
    getOverrideExpression(): string | undefined;
    onOverride(cb: CB_CCBLEmitter<string | undefined>): this;
    offOverride(cb: CB_CCBLEmitter<string | undefined>): this;
}
