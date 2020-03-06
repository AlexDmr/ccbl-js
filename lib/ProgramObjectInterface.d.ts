import { ChannelInterface } from "./ChannelInterface";
import { CCBLEventInterface } from "./EventInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { AllenType } from "./AllenInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLContextState, CCBLContextStateAny } from "./ContextState";
import { ChannelActionState } from "./ChannelActionState";
import { ChannelActionEvent } from "./ChannelActionEvent";
import { CCBLContextEvent } from "./ContextEvent";
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
export interface ProgramReference {
    programId: string;
    as: string;
    mapInputs?: {
        [key: string]: string;
    };
}
export interface AllenRelationships {
    During?: ContextOrProgram[];
    StartWith?: ContextOrProgram[];
    EndWith?: ContextOrProgram[];
    Meet?: {
        contextsSequence: HumanReadableContext[];
        loop?: number;
    };
}
export interface HumanReadableStateAction {
    channel: string;
    affectation: Affectation;
    ccblAction?: ChannelActionState<any>;
}
export declare type HumanReadableEventAction = HumanReadableEventChannelAction | HumanReadableEventTriggerAction;
export declare type HumanReadableEventTriggerAction = {
    eventer: string;
    expression: string;
};
export declare type HumanReadableEventChannelAction = {
    channel: string;
    affectation: string;
    ccblAction?: ChannelActionEvent<any>;
};
export interface EventTrigger {
    eventName?: string;
    eventSource: string;
    eventFilter?: string;
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
    ccblContext?: CCBLContextState<any, any>;
}
export interface HumanReadableEventContext extends EventTrigger {
    contextName: string;
    actions: HumanReadableEventAction[];
    ccblContext?: CCBLContextEvent;
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
}
export declare function ProgramsEquivalents(A: {
    [keys: string]: HumanReadableProgram;
}, B: {
    [keys: string]: HumanReadableProgram;
}): boolean;
export declare function progEquivalent(P1: HumanReadableProgram, P2: HumanReadableProgram): boolean;
export declare function allenEquivalent(A: AllenRelationships, B: AllenRelationships): boolean;
export declare function contextsMeetEquivalent(A: {
    contextsSequence: HumanReadableContext[];
    loop?: number;
}, B: {
    contextsSequence: HumanReadableContext[];
    loop?: number;
}): boolean;
export declare function contextsEquivalent(A: ContextOrProgram[], B: ContextOrProgram[]): boolean;
export declare function contextEquivalent(A: ContextOrProgram, B: ContextOrProgram): boolean;
export declare function eventEquivalent(A: EventTrigger, B: EventTrigger): boolean;
export declare function mapInputsEquivalent(A: {
    [key: string]: string;
}, B: {
    [key: string]: string;
}): boolean;
export declare function DependenciesEquivalents(A: ImportExportConfig, B: ImportExportConfig): boolean;
export declare function variablesEquivalents(A: VariableDescription[], B: VariableDescription[]): boolean;
export declare function eventActionsEquivalent(A: HumanReadableEventAction[], B: HumanReadableEventAction[]): boolean;
export declare function stateActionsEquivalents(A: HumanReadableStateAction[], B: HumanReadableStateAction[]): boolean;