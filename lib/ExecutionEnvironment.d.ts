import { CCBLClock } from "./Clock";
import { FCT_CONTEXT_ORDER } from "./ContextOrders";
import { CCBLEnvironmentExecutionInterface, CCBLEnvironmentExecutionJSON } from "./ExecutionEnvironmentInterface";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { CCBLEventInterface } from "./EventInterface";
import { ProgVarForExpr } from "./ProgramObjectInterface";
export declare class CCBLEnvironmentExecution implements CCBLEnvironmentExecutionInterface {
    protected clock: CCBLClock;
    protected contextOrder: FCT_CONTEXT_ORDER;
    private mapCCBLEmitterValue;
    private mapChannel;
    private mapEvents;
    private mapProgVar;
    constructor(clock: CCBLClock, contextOrder?: FCT_CONTEXT_ORDER);
    toJSON(): CCBLEnvironmentExecutionJSON;
    get_Clock(): CCBLClock;
    set_Clock(clock: CCBLClock): this;
    unregisterCCBLEvent(id: string): this;
    registerCCBLEvent(id: string, ccblEvent: CCBLEventInterface<any>): this;
    getCCBLEvent(id: string): CCBLEventInterface<any>;
    unregister_CCBLEmitterValue(id: string): this;
    register_CCBLEmitterValue(id: string, EV: CCBLEmitterValueInterface<any>): this;
    get_CCBLEmitterValue_FromId(id: string): CCBLEmitterValueInterface<any>;
    unregister_Channel(id: string): this;
    register_Channel(id: string, chan: ChannelInterface<any>): this;
    unregisterProgInstance(id: string): this;
    registerProgInstance(id: string, progVar: ProgVarForExpr): this;
    getProgInstance(id: string): ProgVarForExpr;
    getAllProgramInstance(): {
        id: string;
        progVar: ProgVarForExpr;
    }[];
    get_Channel_FromId(id: string): ChannelInterface<any>;
    getAllEmitterValues(): CCBLEmitterValueInterface<any>[];
    getAllChannels(): ChannelInterface<any>[];
    getNameOfChannel(channel: ChannelInterface<any>): null | string;
    private isNameUsed;
}
