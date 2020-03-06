import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
export interface ChannelActionInterface {
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
    overhideWith(value: string): this;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
}
