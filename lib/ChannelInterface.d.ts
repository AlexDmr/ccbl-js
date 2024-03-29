import { CCBLEmitterValueInterface, CCBLEmitterValueJSON } from "./EmitterValueInterface";
import { CB_CCBLEvent } from "./EventInterface";
import { ChannelActionEventInterface, ChannelActionStateInterface } from "./ChannelActionStateEventInterface";
export interface ChannelInterface<T> {
    getChannelId(): string;
    isAvailable(): boolean;
    readonly hasActiveAction: CCBLEmitterValueInterface<boolean>;
    getValueEmitter(): CCBLEmitterValueInterface<T | undefined>;
    shouldConsiderCommitting(): boolean;
    getConstraintsAndStateAction(): ActiveStateConfig<T>;
    commit(): boolean;
    append(channelAction: ChannelActionStateOrEvent): any;
    remove(channelAction: ChannelActionStateOrEvent): any;
    update(newStateActions?: ChannelActionStateOrEvent[]): any;
    toJSON(): ChannelJSON;
    dispose(): void;
}
export declare type ChannelJSON = {
    available: boolean;
    id: string;
    type: string;
    valueEmitter: CCBLEmitterValueJSON;
};
export declare type configActiveActionEvent<T> = {
    channelActionEvent: ChannelActionEventInterface;
    channel: ChannelInterface<T>;
    cb: CB_CCBLEvent<T>;
};
export declare type ChannelActionStateOrEvent = ChannelActionStateInterface | ChannelActionEventInterface;
export declare type ActiveStateConfig<T> = {
    stateConstraints: ChannelActionStateInterface[];
    channelActionEvents: ChannelActionEventInterface[];
    channelActionState?: ChannelActionStateInterface;
    emitterValue?: CCBLEmitterValueInterface<T>;
};
