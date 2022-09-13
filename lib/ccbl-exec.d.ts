import { ContextsUpdate, ActionsUpdate, ActionUpdate, ChannelUpdate, ContextUpdate, ExportedEmitterUpdate, PayloadForMain, PayloadForThread, ProgramUpdate, WorkerP, ChannelsUpdate, ExportedEmittersUpdate } from "./ccbl-exec-data";
import { HumanReadableProgram } from "./ProgramObjectInterface";
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
    private change;
    constructor(W: WorkerP<PayloadForThread, PayloadForMain>);
    loadHumanReadableProgram(program: HumanReadableProgram): Promise<PayloadForMain>;
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
