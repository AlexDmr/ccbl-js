import { CCBLContext } from "./Context";
import { ChannelActionInterface } from "./ChannelActionStateEventInterface";
import { CCBLEmitterValue } from "./EmitterValue";
import { ChannelInterface, ChannelJSON } from "./ChannelInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
export declare type ChannelActionJSON = {
    type: string;
    channel: ChannelJSON;
};
export declare abstract class ChannelAction<T> implements ChannelActionInterface {
    channel: ChannelInterface<T>;
    jsonDirty: CCBLEmitterValue<boolean>;
    protected active: boolean;
    private attaching;
    private context;
    private isActivated;
    cbEmitterChange: any;
    abstract readonly id: string;
    constructor(channel: ChannelInterface<T>);
    dispose(): void;
    toJSON(): ChannelActionJSON;
    getIsActivated(): CCBLEmitterValueInterface<boolean>;
    isChannelActionState(): boolean;
    isChannelActionEvent(): boolean;
    applyTo(V: T): T;
    getChannel(): ChannelInterface<T>;
    getPriority(): number;
    attachTo(context: CCBLContext | undefined): this;
    activate(value?: boolean): this;
}
