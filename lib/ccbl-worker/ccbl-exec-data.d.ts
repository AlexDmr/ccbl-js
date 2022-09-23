import { AllenType } from "../AllenInterface";
import { AlxWorker } from "./ccbl-alx-worker";
import { CcblProgramElementsJSON, HumanReadableProgram } from "../ProgramObjectInterface";
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
export interface ProgramAccess {
    owners: readonly string[];
    R: readonly string[];
    W: readonly string[];
}
export interface MessageForThread<PM> {
    readonly idMsg: number;
    readonly msg: PM;
}
export declare type ResponseForMain<PR> = {
    readonly type: "ok";
    readonly idMsg: number;
    readonly res: PR;
} | {
    readonly type: "error";
    readonly idMsg: number;
    readonly res: string;
};
export interface ProgramUpdate extends CcblProgramElementsJSON {
    readonly type: "program update";
}
export interface ChannelUpdate {
    readonly type: "channel update";
    readonly channelId: string;
    readonly channelValue: string;
    readonly hasActiveAction: boolean;
}
export interface ChannelsUpdate {
    readonly type: "channels update";
    readonly list: readonly [channelId: string, channelValue: string, hasActiveAction: boolean][];
}
export interface ExportedEmitterUpdate {
    readonly type: "exported emitter update";
    readonly emitterId: string;
    readonly emitterValue: string;
}
export interface ExportedEmittersUpdate {
    readonly type: "exported emitters update";
    readonly list: readonly [emitterId: string, emitterValue: string][];
}
export interface ExportedEventerUpdate {
    readonly type: "exported eventer update";
    readonly eventerId: string;
    readonly eventerValue: string;
}
export interface ActionUpdate {
    readonly type: "action update";
    readonly actionId: string;
    readonly active: boolean;
    readonly overrided: undefined | string;
}
export interface ActionsUpdate {
    readonly type: "actions update";
    readonly list: readonly [actionId: string, active: boolean, overrided: undefined | string][];
}
export interface ContextUpdate {
    readonly type: "context update";
    readonly contextId: string;
    readonly active: boolean;
}
export interface ContextsUpdate {
    readonly type: "contexts update";
    readonly list: readonly [contextId: string, active: boolean][];
}
export declare type PayloadForMain = undefined | ExportedEventerUpdate | ActionsUpdate | ActionUpdate | ContextUpdate | ContextsUpdate | ProgramUpdate | ChannelUpdate | ChannelsUpdate | ExportedEmitterUpdate | ExportedEmittersUpdate;
export declare type PayloadForThread = {
    readonly type: "LoadRootProgram";
    readonly program: HumanReadableProgram;
} | {
    readonly type: "SIMULATION";
    readonly command: "START" | "STOP";
} | {
    readonly type: "appendSubProgram";
    readonly subProgramId: string;
    readonly subProgram: HumanReadableProgram;
} | {
    readonly type: "removeSubProgram";
    readonly subProgramId: string;
} | {
    readonly type: "plugSubProgramAs";
    readonly programId: string;
    readonly as: string;
    readonly mapInputs: {
        [key: string]: string;
    };
    readonly allen: AllenType;
    readonly hostContextName: string;
} | {
    readonly type: "unplugSubProgramInstance";
    readonly instanceName: string;
} | {
    readonly type: "emitterUpdate";
    readonly emitterId: string;
    readonly emitterValue: string;
} | {
    readonly type: "eventUpdate";
    readonly eventId: string;
    readonly eventValue: string;
};
