import { ChannelInterface } from "./ChannelInterface";
import { CCBLEventInterface } from "./EventInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { AllenType } from "./AllenInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLContextState, CCBLContextStateAny } from "./ContextState";
import { CCBLContextEvent } from "./ContextEvent";
import { ChannelActionEventInterface, ChannelActionStateInterface } from "./ChannelActionStateEventInterface";
export declare type ProgVarForExpr = {
    [key: string]: CCBLEmitterValueInterface<any>;
};
export interface CcblProgramElements {
    program: CCBLProgramObjectInterface;
    subProgramInstances: {
        [id in string]: CcblProgramElements;
    };
    stateContexts: {
        [id in string]: CCBLContextStateAny;
    };
    eventContexts: {
        [id in string]: CCBLContextEvent;
    };
    stateActions: {
        [id in string]: ChannelActionStateInterface;
    };
    eventActions: {
        [id in string]: ChannelActionEventInterface;
    };
}
export interface CCBLProgramObjectInterface {
    dispose(): any;
    getRootContext(): CCBLContextState<any, any>;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    getHumanReadableDescription(): HumanReadableProgram | undefined;
    getCcblElements(): CcblProgramElements;
    activate(v?: boolean): this;
    UpdateChannelsActions(): any;
    loadHumanReadableProgram(descr: HumanReadableProgram, env: CCBLEnvironmentExecutionInterface, mapInputs: {
        [key: string]: string;
    }): CCBLProgramObjectInterface;
    appendSubProgram(programId: string, description: HumanReadableProgram): this;
    removeSubProgram(programId: string): this;
    plugSubProgramAs(config: {
        programId: string;
        as: string;
        mapInputs: {
            [key: string]: string;
        };
        allen: AllenType;
        hostContextName: string;
    }): void;
    unplugSubProgramInstance(instanceName: string): any;
    appendStateActions(stateContextId: CCBLContextStateAny, ...actions: HumanReadableStateAction[]): this;
    appendEventActions(eventcontext: CCBLContextEvent, ...actions: HumanReadableEventAction[]): this;
    getProgramInstance(instanceName: string): CCBLProgramObjectInterface | undefined;
    getProgramInstances(progName: string): {
        program: HumanReadableProgram;
        instances: CCBLProgramObjectInterface[];
    } | undefined;
    getEmitterDescription(id: string): EmitterDescription | undefined;
    getEmitter(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEmitterValueInterface<any> | undefined;
    getChannelDescription(id: string): ChannelDescription | undefined;
    getChannel(id: string, env?: CCBLEnvironmentExecutionInterface): ChannelInterface<any> | undefined;
    getChannels(): ChannelInterface<any>[];
    recomputeAllChannelsForUpdate(): any;
    getEventerDescription(id: string): EventerDescription | undefined;
    getEventer(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEventInterface<any> | undefined;
    getValue(id: string): any;
    toHumanReadableProgram(): HumanReadableProgram;
}
export interface VariableDescription {
    name: string;
    type: string;
}
export interface ChannelDescription extends VariableDescription {
    channel: ChannelInterface<any>;
}
export interface EmitterDescription extends VariableDescription {
    emitter: CCBLEmitterValueInterface<any>;
}
export interface EventerDescription extends VariableDescription {
    eventer: CCBLEventInterface<any>;
}
export interface Vocabulary {
    channels?: VariableDescription[];
    emitters?: VariableDescription[];
    events?: VariableDescription[];
}
export interface ImportExportConfig {
    import?: Vocabulary;
    export?: Vocabulary;
}
export interface Affectation {
    type?: "expression" | "constraint";
    value: string;
}
export declare type ContextOrProgram = HumanReadableContext | ProgramReference;
export declare type ProgramInput = string | EventTrigger;
export interface ProgramReference {
    programId: string;
    as: string;
    mapInputs?: {
        [key: string]: ProgramInput;
    };
    id?: string;
}
export interface AllenRelationships {
    During?: ContextOrProgram[];
    StartWith?: ContextOrProgram[];
    EndWith?: ContextOrProgram[];
    Meet?: {
        contextsSequence: HumanReadableStateContext[];
        loop?: number;
    };
}
export interface HumanReadableStateAction {
    channel: string;
    affectation: Affectation;
    id?: string;
}
export declare type HumanReadableEventAction = HumanReadableEventChannelAction | HumanReadableEventTriggerAction;
export declare type HumanReadableEventTriggerAction = {
    eventer: string;
    expression: string;
    id?: string;
};
export declare type HumanReadableEventChannelAction = {
    channel: string;
    affectation: string;
    id?: string;
};
export interface EventTrigger {
    eventName?: string;
    eventSource: string;
    eventExpression?: string;
    eventFilter?: string;
    id?: string;
}
export declare type HumanReadableStateContext = CommonReadableStateContext | HRSC_STATE | HRSC_EVS | HRSC_EVF;
interface CommonReadableStateContext {
    contextName: string;
    type: "STATE";
    actions?: HumanReadableStateAction[];
    allen?: AllenRelationships;
    actionsOnStart?: HumanReadableEventAction[];
    actionsOnEnd?: HumanReadableEventAction[];
    id?: string;
    state?: string;
    eventStart?: EventTrigger;
    eventFinish?: EventTrigger;
}
export interface HRSC_STATE extends CommonReadableStateContext {
    state: string;
}
export interface HRSC_EVS extends CommonReadableStateContext {
    eventStart: EventTrigger;
}
export interface HRSC_EVF extends CommonReadableStateContext {
    eventFinish: EventTrigger;
}
export interface HumanReadableEventContext extends EventTrigger {
    contextName: string;
    type: "EVENT";
    actions: HumanReadableEventAction[];
    id?: string;
}
export declare type HumanReadableContext = HumanReadableStateContext | HumanReadableEventContext;
export interface HumanReadableProgram {
    localChannels?: VariableDescription[];
    dependencies?: ImportExportConfig;
    actions?: HumanReadableStateAction[];
    allen?: AllenRelationships;
    subPrograms?: {
        [key: string]: HumanReadableProgram;
    };
    description?: string;
    name?: string;
}
export declare type VarLocation = 'channels' | 'emitters' | 'events' | 'programs';
export declare type VarRange = 'local' | 'import' | 'export';
export interface DataIsNameUsedInProg {
    location: VarLocation;
    varRange: VarRange;
}
export declare function isNameUsedInProg(name: string, prog: HumanReadableProgram): DataIsNameUsedInProg | undefined;
export declare function getAllContextOrProgramsFromProg(P: HumanReadableProgram): ContextOrProgram[];
export declare function ProgramsEquivalents(A: {
    [keys: string]: HumanReadableProgram;
}, B: {
    [keys: string]: HumanReadableProgram;
}, withId: boolean): boolean;
export declare function progEquivalent(P1: HumanReadableProgram, P2: HumanReadableProgram, withId?: boolean): boolean;
export declare function allenEquivalent(A: AllenRelationships, B: AllenRelationships, withId: boolean): boolean;
export declare function contextsMeetEquivalent(A: {
    contextsSequence: HumanReadableContext[];
    loop?: number;
}, B: {
    contextsSequence: HumanReadableContext[];
    loop?: number;
}, withId: boolean): boolean;
export declare function contextsEquivalent(A: ContextOrProgram[], B: ContextOrProgram[], withId: boolean): boolean;
export declare function contextEquivalent(A: ContextOrProgram, B: ContextOrProgram, withId: boolean): boolean;
export declare function eventEquivalent(A: EventTrigger, B: EventTrigger, withId: boolean): boolean;
export declare function mapInputsEquivalent(A: {
    [key: string]: ProgramInput;
}, B: {
    [key: string]: ProgramInput;
}, withId: boolean): boolean;
export declare function DependenciesEquivalents(A: ImportExportConfig, B: ImportExportConfig): boolean;
export declare function variablesEquivalents(A: VariableDescription[], B: VariableDescription[]): boolean;
export declare function eventActionsEquivalent(A: HumanReadableEventAction[], B: HumanReadableEventAction[], withId: boolean): boolean;
export declare function stateActionsEquivalents(A: HumanReadableStateAction[], B: HumanReadableStateAction[], withId: boolean): boolean;
export declare function copyHumanReadableProgram(prog: HumanReadableProgram): HumanReadableProgram;
export declare function copyContextOrProgram(obj: ContextOrProgram): ContextOrProgram;
export declare function copyProgRef(progRef: ProgramReference): ProgramReference;
export declare function copyAllen(allen: AllenRelationships): AllenRelationships;
export declare function copyHumanReadableEventContext(c: HumanReadableEventContext): HumanReadableEventContext;
export declare function copyHumanReadableStateContext(c: HumanReadableStateContext): HumanReadableStateContext;
export declare function copyHumanReadableEventAction(a: HumanReadableEventAction): HumanReadableEventAction;
export declare function copyEventTrigger(evt: EventTrigger): EventTrigger;
export declare function copyVocabulary(voc: Vocabulary): Vocabulary;
export declare function copyVariableDescription(vd: VariableDescription): VariableDescription;
export declare function copyHumanReadableStateActions(action: HumanReadableStateAction): HumanReadableStateAction;
export declare function cleanStateAction(A: HumanReadableStateAction): HumanReadableStateAction;
export declare function cleanEventAction(A: HumanReadableEventAction): HumanReadableEventAction;
export declare function cleanProgramInstance(P: ProgramReference): ProgramReference;
export declare function cleanContextOrProgram(n: ContextOrProgram): ContextOrProgram;
export declare function cleanStateContext(ctxt: HumanReadableStateContext): HumanReadableStateContext;
export declare function cleanEventContext(C: HumanReadableEventContext): HumanReadableEventContext;
export declare function cleanProgram(P: HumanReadableProgram): HumanReadableProgram;
export {};
