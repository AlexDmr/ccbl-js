import { CCBLClock } from "./Clock";
import { CCBLContextState, CCBLContextStateAny } from "./ContextState";
import { CCBLProgramObjectInterface, ChannelDescription, EmitterDescription, EventerDescription, HumanReadableEventAction, HumanReadableProgram, HumanReadableStateAction } from "./ProgramObjectInterface";
import { AllenType } from "./AllenInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEventInterface } from "./EventInterface";
import { CCBLContextEvent } from "./ContextEvent";
export declare class CCBLProgramObject implements CCBLProgramObjectInterface {
    private name;
    private clock;
    private localSubProgChannelsId;
    private allChannelsForUpdates;
    private localChannelsId;
    private localChannels;
    private inputChannelsId;
    private outputChannelsId;
    private localEmitters;
    private inputEmittersId;
    private outputEmittersId;
    private localEventers;
    private inputEventersId;
    private outputEventersId;
    private rootChannel;
    private rootContext;
    private environment;
    private humanReadableDescription;
    private subPrograms;
    private parentProgram;
    constructor(name: string, clock: CCBLClock);
    dispose(): void;
    UpdateChannelsActions(): void;
    getChannels(): ChannelInterface<any>[];
    recomputeAllChannelsForUpdate(): void;
    activate(v?: boolean): this;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    getRootChannel(): ChannelInterface<boolean>;
    getChannelDescription(id: string): ChannelDescription;
    getChannel(id: string, env?: CCBLEnvironmentExecutionInterface): ChannelInterface<any>;
    getEmitterDescription(id: string): EmitterDescription;
    getEmitter(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEmitterValueInterface<any>;
    getEventerDescription(id: string): EventerDescription;
    getEventer(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEventInterface<any>;
    getValue(id: string): any;
    getClock(): CCBLClock;
    appendEventActions(eventcontext: CCBLContextEvent, ...actions: HumanReadableEventAction[]): this;
    appendStateActions(stateContext: CCBLContextStateAny, ...actions: HumanReadableStateAction[]): this;
    getProgramInstance(instanceName: string): CCBLProgramObjectInterface;
    getProgramInstances(progName: string): {
        program: HumanReadableProgram;
        instances: CCBLProgramObjectInterface[];
    };
    unplugSubProgramInstance(instanceName: string): void;
    removeSubProgram(programId: string): this;
    appendSubProgram(programId: string, description: HumanReadableProgram): this;
    getStateContextNamed(name: string): CCBLContextStateAny;
    plugSubProgramAs(config: {
        programId: string;
        as: string;
        mapInputs: {
            [key: string]: string;
        };
        allen: AllenType;
        hostContextName: string | CCBLContextState<any, any>;
    }): this;
    toHumanReadableProgram(): HumanReadableProgram;
    getHumanReadableDescription(): HumanReadableProgram;
    loadHumanReadableProgram(descr: HumanReadableProgram, env: CCBLEnvironmentExecutionInterface, mapInputs: {
        [key: string]: string;
    }): this;
    private updateStructuralOrder;
    private createLocalEmitter;
    private loadContextOrProgram;
    private loadHumanReadableContext;
    private loadHumanReadableContextevent;
    private loadHumanReadableContextState;
    getRootContext(): CCBLContextState<any, any>;
    private createLocalChannels;
    createLocalEventer(...eventers: EventerDescription[]): EventerDescription[];
    private getSubProgramIdentifiedBy;
}