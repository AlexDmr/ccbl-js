import { CCBLClock } from "./Clock";
import { FCT_CONTEXT_ORDER } from "./ContextOrders";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { CCBLEventInterface } from "./EventInterface";
export declare class CCBLEnvironmentExecution implements CCBLEnvironmentExecutionInterface {
    protected clock: CCBLClock;
    protected contextOrder: FCT_CONTEXT_ORDER;
    private mapCCBLEmitterValue;
    private mapChannel;
    private mapEvents;
    constructor(clock: CCBLClock, contextOrder?: FCT_CONTEXT_ORDER);
    get_Clock(): CCBLClock;
    set_Clock(clock: CCBLClock): this;
    registerCCBLEvent(id: string, ccblEvent: CCBLEventInterface<any>): this;
    getCCBLEvent(id: string): CCBLEventInterface<any>;
    register_CCBLEmitterValue(id: string, EV: CCBLEmitterValueInterface<any>): this;
    get_CCBLEmitterValue_FromId(id: string): CCBLEmitterValueInterface<any>;
    register_Channel(id: string, chan: ChannelInterface<any>): this;
    get_Channel_FromId(id: string): ChannelInterface<any>;
    getAllEmitterValues(): CCBLEmitterValueInterface<any>[];
    getAllChannels(): ChannelInterface<any>[];
}
