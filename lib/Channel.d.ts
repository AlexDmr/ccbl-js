import { CCBLEmitterValue } from "./EmitterValue";
import { ActiveStateConfig, ChannelActionStateOrEvent, ChannelInterface, ChannelJSON, configActiveActionEvent } from "./ChannelInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
export declare function getNewChannel<T>(initialValue: T, valueEmitter?: CCBLEmitterValueInterface<T>): Channel<T>;
export declare class Channel<T> implements ChannelInterface<T> {
    valueEmitter: CCBLEmitterValueInterface<T>;
    dirty: boolean;
    dirtyJSON: boolean;
    lastJSON: ChannelJSON | undefined;
    lastActiveStateConfig: ActiveStateConfig<T> | undefined;
    actions: ChannelActionStateOrEvent[];
    configActiveActionEvents: configActiveActionEvent<T>[];
    readonly hasActiveAction: CCBLEmitterValue<boolean>;
    private cbEmitter;
    private forceCommit;
    constructor(valueEmitter: CCBLEmitterValueInterface<T>);
    dispose(): void;
    getValueEmitter(): CCBLEmitterValueInterface<T | undefined>;
    getChannelId(): string;
    toJSON(): ChannelJSON;
    isAvailable(): boolean;
    setIsAvailable(available: boolean): this;
    append(channelAction: ChannelActionStateOrEvent): void;
    remove(channelAction: ChannelActionStateOrEvent): void;
    update(newStateActions?: ChannelActionStateOrEvent[]): void;
    configChanged(): boolean;
    getConstraintsAndStateAction(): ActiveStateConfig<T>;
    UnlistenToContextEvents(): this;
    ListenToContextEvents(): this;
    overhideValue(newValue: string): this;
    ApplyConstraintsToValue(original: T): T;
    updateValue(newValue: T): this;
    shouldConsiderCommitting(): boolean;
    commit(): boolean;
}
export declare function UpdateChannelsActions(...channels: ChannelInterface<any>[]): void;
export declare function commitStateActions(...channels: ChannelInterface<any>[]): void;
export declare function registerChannel(...channels: ChannelInterface<any>[]): void;
export declare function createChannel<T>(emitter: CCBLEmitterValue<T>): Channel<T>;
export declare function Activate(channelAction: ChannelActionStateOrEvent): void;
export declare function Desactivate(channelAction: ChannelActionStateOrEvent): void;
