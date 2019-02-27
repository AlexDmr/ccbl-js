import { CCBLClock } from "./Clock";
import { CCBLEmitterValueInterface, CCBLEmitterValueJSON } from "./EmitterValueInterface";
import { ChannelInterface, ChannelJSON } from "./ChannelInterface";
import { CCBL_EventJSON, CCBLEventInterface } from "./EventInterface";
export declare type CCBLEnvironmentExecutionJSON = {
    events: {
        [key: string]: CCBL_EventJSON;
    };
    emitters: {
        [key: string]: CCBLEmitterValueJSON;
    };
    channels: {
        [key: string]: ChannelJSON;
    };
};
export interface CCBLEnvironmentExecutionInterface {
    toJSON(): CCBLEnvironmentExecutionJSON;
    get_Clock(): CCBLClock;
    set_Clock(clock: CCBLClock): this;
    register_CCBLEmitterValue(id: string, EV: CCBLEmitterValueInterface<any>): this;
    get_CCBLEmitterValue_FromId(id: string): CCBLEmitterValueInterface<any>;
    register_Channel(id: string, chan: ChannelInterface<any>): this;
    get_Channel_FromId(id: string): ChannelInterface<any>;
    registerCCBLEvent(id: string, ccblEvent: CCBLEventInterface<any>): this;
    getCCBLEvent(id: string): CCBLEventInterface<any>;
    getAllEmitterValues(): CCBLEmitterValueInterface<any>[];
    getAllChannels(): ChannelInterface<any>[];
    getNameOfChannel(channel: ChannelInterface<any>): string;
}
