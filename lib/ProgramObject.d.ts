import { CCBLClock } from "./Clock";
import { CCBLContextState, CCBLContextStateAny } from "./ContextState";
import { CcblProgramElements, CCBLProgramObjectInterface, ChannelDescription, EmitterDescription, EventerDescription, HumanReadableEventAction, HumanReadableProgram, HumanReadableStateAction, ProgramInput, VariableDescription } from "./ProgramObjectInterface";
import { AllenType } from "./AllenInterface";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLEventInterface } from "./EventInterface";
import { CCBLContextEvent } from "./ContextEvent";
export declare class CCBLProgramObject implements CCBLProgramObjectInterface {
    private name;
    private clock;
    private bindedEmittersAndEvents;
    private localSubProgChannelsId;
    private allChannelsForUpdates;
    private localChannels;
    private localChannelsId;
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
    getCcblElements(): CcblProgramElements;
    UpdateChannelsActions(): void;
    getChannels(): ChannelInterface<any>[];
    recomputeAllChannelsForUpdate(): void;
    activate(v?: boolean): this;
    getEnvironment(): CCBLEnvironmentExecutionInterface;
    getRootChannel(): ChannelInterface<boolean>;
    getChannelDescription(id: string): ChannelDescription | undefined;
    getChannel(id: string, env?: CCBLEnvironmentExecutionInterface): ChannelInterface<any> | undefined;
    getEmitterDescription(id: string): EmitterDescription | undefined;
    getEmitter(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEmitterValueInterface<any> | undefined;
    getEventerDescription(id: string): EventerDescription | undefined;
    getEventer(id: string, env?: CCBLEnvironmentExecutionInterface): CCBLEventInterface<any> | undefined;
    getValue(id: string): any;
    getClock(): CCBLClock;
    appendEventActions(eventcontext: CCBLContextEvent, ...actions: HumanReadableEventAction[]): this;
    appendStateActions(stateContext: CCBLContextStateAny, ...actions: HumanReadableStateAction[]): this;
    getProgramInstance(instanceName: string): CCBLProgramObjectInterface | undefined;
    getProgramInstances(progName: string): {
        program: HumanReadableProgram;
        instances: CCBLProgramObjectInterface[];
    } | undefined;
    unplugSubProgramInstance(instanceName: string): void;
    removeSubProgram(programId: string): this;
    appendSubProgram(programId: string, description: HumanReadableProgram): this;
    getStateContextNamed(name: string): CCBLContextStateAny | undefined;
    plugSubProgramAs(config: {
        programId: string;
        as: string;
        mapInputs: {
            [key: string]: ProgramInput;
        };
        allen: AllenType;
        description: string | undefined;
        hostContextName: string | CCBLContextState<any, any>;
    }): CCBLProgramObjectInterface;
    toHumanReadableProgram(): HumanReadableProgram;
    getHumanReadableDescription(): HumanReadableProgram | undefined;
    loadHumanReadableProgram(descr: HumanReadableProgram, env: CCBLEnvironmentExecutionInterface, mapInputs: {
        [key: string]: ProgramInput;
    }): this;
    private updateStructuralOrder;
    private createLocalEmitter;
    private loadContextOrProgram;
    private loadHumanReadableContext;
    private loadHumanReadableContextevent;
    private loadHumanReadableContextState;
    getRootContext(): CCBLContextState<any, any>;
    private createLocalChannelsFromVars;
    private createLocalChannels;
    createLocalEventerFromVars(...vars: VariableDescription[]): EventerDescription[];
    createLocalEventer(...eventers: EventerDescription[]): EventerDescription[];
    private getSubProgramIdentifiedBy;
}
