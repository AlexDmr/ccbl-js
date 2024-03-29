import { CCBLEventInterface, CCBL_EventJSON } from "./EventInterface";
import { ChannelActionState } from "./ChannelActionState";
import { CCBLContext } from "./Context";
import { ChannelActionJSON } from "./ChannelAction";
import { CCBLAllenJSON } from "./Allen";
import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
import { CCBLStateInExecutionEnvironment, CCBLStateInExecutionEnvironmentJSON } from "./StateInExecutionEnvironment";
import { CCBLContextEvent } from "./ContextEvent";
import { ChannelActionStateInterface } from "./ChannelActionStateEventInterface";
export declare type CCBLContextStateJSON = {
    type: string;
    state?: CCBLStateInExecutionEnvironmentJSON;
    eventStart?: CCBL_EventJSON;
    eventFinish?: CCBL_EventJSON;
    actionsOnStart: ChannelActionJSON[];
    actionsOnFinish: ChannelActionJSON[];
    parentOfAllenRelationships: CCBLAllenJSON[];
    channelActions: ChannelActionJSON[];
    activable: boolean;
    rootOfProgramId?: string;
    contextName: string;
};
export declare type configCCBLContextState<T_EVENT_START, T_EVENT_FINISH> = {
    environment: CCBLEnvironmentExecutionInterface;
    state?: CCBLStateInExecutionEnvironment;
    eventStart?: CCBLEventInterface<T_EVENT_START>;
    eventFinish?: CCBLEventInterface<T_EVENT_FINISH>;
    rootOfProgramId?: string;
    contextName: string;
};
export declare class CCBLContextState<T_EVENT_START, T_EVENT_FINISH> extends CCBLContext {
    environment: CCBLEnvironmentExecutionInterface;
    state: CCBLStateInExecutionEnvironment | undefined;
    eventStart: CCBLEventInterface<T_EVENT_START> | undefined;
    eventFinish: CCBLEventInterface<T_EVENT_FINISH> | undefined;
    eventContextStart: CCBLContextEvent;
    eventContextEnd: CCBLContextEvent;
    rootOfProgramId: string | undefined;
    protected contextName: string;
    protected lastJSONState: CCBLContextStateJSON | undefined;
    private msEventStart;
    private active;
    private cb_jsonDirty;
    readonly id: string;
    constructor(config: configCCBLContextState<T_EVENT_START, T_EVENT_FINISH>);
    dispose(): void;
    getType(): "CCBLContextState" | "CCBLContextEvent";
    toJSON(): CCBLContextStateJSON;
    getChannelActionStates(): ChannelActionStateInterface[];
    getActive(): boolean;
    getActivable(): boolean;
    setActivable(value?: boolean): this;
    appendChannelActions(...actions: ChannelActionState<any>[]): this;
    private updateActive;
    private cbEventStart;
    private cbEventFinish;
    private cbStateChange;
}
export declare type CCBLContextStateAny = CCBLContextState<any, any>;
export declare type CCBLContextStateStartWith = CCBLContextState<undefined, any>;
export declare type CCBLContextStateEndWith = CCBLContextState<any, undefined>;
