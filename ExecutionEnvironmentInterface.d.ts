import { CCBLClock } from "./Clock";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEventInterface } from "./EventInterface";
export interface CCBLEnvironmentExecutionInterface {
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
}
