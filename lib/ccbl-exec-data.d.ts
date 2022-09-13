import { AllenType } from "./AllenInterface";
import { AlxWorker } from "./ccbl-alx-worker";
import { HumanReadableProgram } from "./ProgramObjectInterface";
export declare class WorkerP<PM, PR> {
    private worker;
    private mapMsg;
    private idMsg;
    constructor(worker: AlxWorker);
    dispose(): void;
    postMessage(value: PM): void;
    promisePost(m: PM): Promise<PR>;
    addEventListener(listenerOK: (m: PR) => void, listenerError?: (err: any) => void): {
        Lcb: readonly ((M: ResponseForMain<PR>) => void)[];
        unsubscribe(): void;
    };
}
export interface MessageForThread<PM> {
    idMsg: number;
    msg: PM;
}
export declare type ResponseForMain<PR> = {
    type: "ok";
    idMsg: number;
    res: PR;
} | {
    type: "error";
    idMsg: number;
    res: string;
};
export interface ProgramUpdate {
    type: "program update";
    program: HumanReadableProgram;
    subProgramInstances: string[];
    stateContexts: string[];
    eventContexts: string[];
    stateActions: string[];
    eventActions: string[];
}
export interface ChannelUpdate {
    type: "channel update";
    channelId: string;
    channelValue: string;
}
export interface ChannelsUpdate {
    type: "channels update";
    list: [channelId: string, channelValue: string][];
}
export interface ExportedEmitterUpdate {
    type: "exported emitter update";
    emitterId: string;
    emitterValue: string;
}
export interface ExportedEmittersUpdate {
    type: "exported emitters update";
    list: [emitterId: string, emitterValue: string][];
}
export interface ExportedEventerUpdate {
    type: "exported eventer update";
    eventerId: string;
    eventerValue: string;
}
export interface ActionUpdate {
    type: "action update";
    actionId: string;
    active: boolean;
    overrided: undefined | string;
}
export interface ActionsUpdate {
    type: "actions update";
    list: [actionId: string, active: boolean, overrided: undefined | string][];
}
export interface ContextUpdate {
    type: "context update";
    contextId: string;
    active: boolean;
}
export interface ContextsUpdate {
    type: "contexts update";
    list: [contextId: string, active: boolean][];
}
export declare type PayloadForMain = undefined | ExportedEventerUpdate | ActionsUpdate | ActionUpdate | ContextUpdate | ContextsUpdate | ProgramUpdate | ChannelUpdate | ChannelsUpdate | ExportedEmitterUpdate | ExportedEmittersUpdate;
export declare type PayloadForThread = {
    type: "LoadRootProgram";
    program: HumanReadableProgram;
} | {
    type: "SIMULATION";
    command: "START" | "STOP";
} | {
    type: "appendSubProgram";
    subProgramId: string;
    subProgram: HumanReadableProgram;
} | {
    type: "removeSubProgram";
    subProgramId: string;
} | {
    type: "plugSubProgramAs";
    programId: string;
    as: string;
    mapInputs: {
        [key: string]: string;
    };
    allen: AllenType;
    hostContextName: string;
} | {
    type: "unplugSubProgramInstance";
    instanceName: string;
} | {
    type: "emitterUpdate";
    emitterId: string;
    emitterValue: string;
} | {
    type: "eventUpdate";
    eventId: string;
    eventValue: string;
};
