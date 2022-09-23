import { ContextsUpdate, ActionsUpdate, ActionUpdate, ChannelUpdate, ContextUpdate, ExportedEmitterUpdate, PayloadForMain, PayloadForThread, ProgramUpdate, WorkerP, ChannelsUpdate, ExportedEmittersUpdate, ProgramAccess } from "./ccbl-exec-data";
import { CcblProgramElementsJSON, HumanReadableProgram, InstancePath, ProgramPath } from "../ProgramObjectInterface";
declare type Tchange = [
    ["program", (P: ProgramUpdate) => void, ProgramUpdate],
    ["channel", (C: ChannelUpdate | ChannelsUpdate) => void, ChannelUpdate],
    [
        "emitter",
        (C: ExportedEmitterUpdate | ExportedEmittersUpdate) => void,
        ExportedEmitterUpdate
    ],
    ["context", (C: ContextUpdate | ContextsUpdate) => void, ContextUpdate],
    ["action", (C: ActionUpdate | ActionsUpdate) => void, ActionUpdate]
];
export declare type Changes = {
    [K in Exclude<keyof Tchange, keyof []> as Tchange[K][0]]: {
        values: Map<string, Tchange[K][2]>;
        Lcb: Tchange[K][1][];
    };
};
export declare type SubscribeParamChange = {
    [K in Exclude<keyof Tchange, keyof []>]: [
        Tchange[K][0],
        Tchange[K][1]
    ];
};
export declare class CCBLProgramWorker {
    private W;
    private access;
    private change;
    constructor(W: WorkerP<PayloadForThread, PayloadForMain>);
    get currentElements(): CcblProgramElementsJSON | undefined;
    getProgramElements(path: ProgramPath): CcblProgramElementsJSON | undefined;
    getLastActionUpdateFor(actionId: string): ActionUpdate | undefined;
    getLastContextUpdateFor(contextId: string): ContextUpdate | undefined;
    private getAccessPathFor;
    hasAccess(userId: string, path: ProgramPath): "OWNER" | "R" | "W" | "";
    provideAccess(path: ProgramPath, access: ProgramAccess): {
        type: "success";
        path: InstancePath;
        access: ProgramAccess;
    } | {
        type: "error";
        reason: string;
    };
    loadHumanReadableProgram(program: HumanReadableProgram): Promise<PayloadForMain>;
    getCcblChannel(id: string): undefined | Pick<ChannelUpdate, "channelValue" | "hasActiveAction">;
    getCcblEmitter(id: string): undefined | {
        value: string;
    };
    on(...[eventType, cb]: SubscribeParamChange[keyof SubscribeParamChange]): this;
    off(...[eventType, cb]: SubscribeParamChange[keyof SubscribeParamChange]): this;
    processMessage(msg: PayloadForThread): this;
    setEmitterValue<T>(emitterId: string, emitterValue: T, mode: "direct"): this;
    setEmitterValue<T>(emitterId: string, emitterValue: T, mode: "promise"): Promise<PayloadForMain>;
    activateSimulation(command: "START" | "STOP", mode: "promise"): Promise<PayloadForMain>;
    activateSimulation(command: "START" | "STOP", mode: "direct"): this;
    private send;
}
export {};
