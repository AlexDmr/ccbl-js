import { ChannelInterface } from "./ChannelInterface";
import { CCBLEventInterface } from "./EventInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { AllenType } from "./AllenInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLContextState, CCBLContextStateAny } from "./ContextState";
import { ChannelActionState } from "./ChannelActionState";
import { ChannelActionEvent } from "./ChannelActionEvent";
import { CCBLContextEvent } from "./ContextEvent";
export declare type ProgVarForExpr = {
    [key: string]: CCBLEmitterValueInterface<any>;
};
export interface CCBLProgramObjectInterface {
    dispose(): any;
    getRootContext(): CCBLContextState<any, any>;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    getHumanReadableDescription(): HumanReadableProgram;
    activate(v?: boolean): this;
    UpdateChannelsActions(): any;
    loadHumanReadableProgram(descr: HumanReadableProgram, env: CCBLEnvironmentExecutionInterface, mapInputs: {
        [key: string]: string;
    }): this;
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
    }): this;
    unplugSubProgramInstance(instanceName: string): any;
    appendStateActions(stateContextId: CCBLContextStateAny, ...actions: HumanReadableStateAction[]): this;
    appendEventActions(eventcontext: CCBLContextEvent, ...actions: HumanReadableEventAction[]): this;
    getProgramInstance(instanceName: string): CCBLProgramObjectInterface;
    getProgramInstances(progName: string): {
        program: HumanReadableProgram;
        instances: CCBLProgramObjectInterface[];
    };
    getEmitterDescription(id: string): EmitterDescription;
    getEmitter(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEmitterValueInterface<any>;
    getChannelDescription(id: string): ChannelDescription;
    getChannel(id: string, env?: CCBLEnvironmentExecutionInterface): ChannelInterface<any>;
    getChannels(): ChannelInterface<any>[];
    recomputeAllChannelsForUpdate(): any;
    getEventerDescription(id: string): EventerDescription;
    getEventer(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEventInterface<any>;
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
    ccblAction?: ChannelActionState<any>;
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
    ccblAction?: ChannelActionEvent<any>;
    id?: string;
};
export interface EventTrigger {
    eventName?: string;
    eventSource: string;
    eventExpression?: string;
    eventFilter?: string;
    id?: string;
}
export interface HumanReadableStateContext {
    contextName: string;
    eventStart?: EventTrigger;
    state?: string;
    eventFinish?: EventTrigger;
    actions?: HumanReadableStateAction[];
    allen?: AllenRelationships;
    actionsOnStart?: HumanReadableEventAction[];
    actionsOnEnd?: HumanReadableEventAction[];
    ccblContext?: CCBLContextStateAny;
    id?: string;
}
export interface HumanReadableEventContext extends EventTrigger {
    contextName: string;
    actions: HumanReadableEventAction[];
    ccblContext?: CCBLContextEvent;
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
    ccblContext?: CCBLContextStateAny;
    description?: string;
    name?: string;
}
export declare type VarLocation = 'channels' | 'emitters' | 'events' | 'programs';
export declare type VarRange = 'local' | 'import' | 'export';
export interface DataIsNameUsedInProg {
    location: VarLocation;
    varRange: VarRange;
}
export declare function isNameUsedInProg(name: string, prog: HumanReadableProgram): DataIsNameUsedInProg;
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
export declare function copyHumanReadableProgram(prog: HumanReadableProgram, withCcblRef?: boolean): HumanReadableProgram;
export declare function copyContextOrProgram(obj: ContextOrProgram, withCcblRef?: boolean): ContextOrProgram;
export declare function copyProgRef(progRef: ProgramReference): ProgramReference;
export declare function copyAllen(allen: AllenRelationships, withCcblRef?: boolean): AllenRelationships;
export declare function copyHumanReadableEventContext(c: HumanReadableEventContext, withCcblRef?: boolean): HumanReadableEventContext;
export declare function copyHumanReadableStateContext(c: HumanReadableStateContext, withCcblRef?: boolean): HumanReadableStateContext;
export declare function copyHumanReadableEventAction(a: HumanReadableEventAction, withCcblRef?: boolean): HumanReadableEventAction;
export declare function copyEventTrigger(evt: EventTrigger): EventTrigger;
export declare function copyVocabulary(voc: Vocabulary): Vocabulary;
export declare function copyVariableDescription(vd: VariableDescription): VariableDescription;
export declare function copyHumanReadableStateActions(action: HumanReadableStateAction, withCcblRef?: boolean): HumanReadableStateAction;
