import { ActionUpdate, ChannelUpdate, ContextUpdate, ExportedEmitterUpdate, PayloadForMain, PayloadForThread, ProgramUpdate, WorkerP } from "./ccbl-exec-data";
import { HumanReadableProgram } from "./ProgramObjectInterface";
declare type Tchange = [
    ["program", (P: ProgramUpdate) => void],
    ["channel", (C: ChannelUpdate) => void],
    ["emitter", (C: ExportedEmitterUpdate) => void],
    ["context", (C: ContextUpdate) => void],
    ["action", (C: ActionUpdate) => void]
];
export declare type Changes = {
    [K in Exclude<keyof Tchange, keyof []> as Tchange[K][0]]: {
        values: Map<string, Parameters<Tchange[K][1]>>;
        Lcb: Tchange[K][1][];
    };
};
export declare class CCBLProgramWorker {
    private W;
    private change;
    constructor(W: WorkerP<PayloadForThread, PayloadForMain>);
    loadHumanReadableProgram(program: HumanReadableProgram): Promise<PayloadForMain>;
    on(...[eventType, cb]: Tchange[number]): this;
    off(...[eventType, cb]: Tchange[number]): this;
    setEmitterValue<T>(emitterId: string, emitterValue: T, mode: "direct"): this;
    setEmitterValue<T>(emitterId: string, emitterValue: T, mode: "promise"): Promise<PayloadForMain>;
    activateSimulation(command: "START" | "STOP", mode: "promise"): Promise<PayloadForMain>;
    activateSimulation(command: "START" | "STOP", mode: "direct"): this;
    private send;
}
export {};
