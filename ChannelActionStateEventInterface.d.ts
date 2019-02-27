import { CCBLExpressionInExecutionEnvironment } from "./CCBLExpressionInExecutionEnvironment";
import { ChannelInterface } from "./ChannelInterface";
export interface ChannelActionInterface {
    getPriority(): number;
    getChannel(): ChannelInterface<any>;
    isChannelActionEvent(): boolean;
    isChannelActionState(): boolean;
}
export interface ChannelActionEventInterface extends ChannelActionInterface {
    getValueGetter(): CCBLExpressionInExecutionEnvironment<any>;
    getContextEvent(): any;
}
export interface ChannelActionStateInterface extends ChannelActionInterface {
    getValueGetter(): any;
    isValueGetterAConstraint(): boolean;
    overhideWith(value: string): this;
}
