import { CCBLContext } from "./Context";
import { ChannelActionInterface } from "./ChannelActionStateEventInterface";
import { CCBLEmitterValue } from "./EmitterValue";
import { ChannelInterface, ChannelJSON } from "./ChannelInterface";
export declare type ChannelActionJSON = {
    type: string;
    channel: ChannelJSON;
};
export declare class ChannelAction<T> implements ChannelActionInterface {
    channel: ChannelInterface<T>;
    jsonDirty: CCBLEmitterValue<boolean>;
    protected active: boolean;
    private attaching;
    private context;
    constructor(channel: ChannelInterface<T>);
    toJSON(): ChannelActionJSON;
    isChannelActionState(): boolean;
    isChannelActionEvent(): boolean;
    applyTo(V: T): T;
    getChannel(): ChannelInterface<T>;
    getPriority(): number;
    attachTo(context: CCBLContext): this;
    activate(value?: boolean): this;
}
