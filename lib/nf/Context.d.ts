import { CCBLAllenInterface } from "./AllenInterface";
import { ChannelAction } from "./ChannelAction";
import { CCBLContextJSON as CCBLContextJSON_fromInterface, CCBLContextInterface } from "./ContextInterface";
import { ChannelInterface } from "./ChannelInterface";
import { CCBLContextStateAny } from "./ContextState";
export declare type CCBLContextJSON = CCBLContextJSON_fromInterface;
export declare abstract class CCBLContext implements CCBLContextInterface {
    priority: number;
    protected parentOfAllenRelationships: CCBLAllenInterface[];
    protected referedByAllenRelationships: CCBLAllenInterface[];
    protected activable: boolean;
    protected channelActions: Map<ChannelInterface<any>, ChannelAction<any>>;
    protected lastJSON: CCBLContextJSON | undefined;
    protected jsonDirty: boolean;
    protected abstract contextName: string;
    dispose(): void;
    protected cbActionDirty: (dirty: boolean) => void;
    setJsonDirty(): this;
    getType(): string;
    toJSON(): CCBLContextJSON;
    getContextName(): string;
    getChannelActions(): ChannelAction<any>[];
    appendParentOfAllenRelationships(...allens: CCBLAllenInterface[]): this;
    removeParentOfAllenRelationships(...allens: CCBLAllenInterface[]): this;
    appendReferedByAllenRelationships(...allens: CCBLAllenInterface[]): this;
    removeReferedByAllenRelationships(...allens: CCBLAllenInterface[]): this;
    getActivable(): boolean;
    setActivable(value?: boolean): this;
    getActive(): boolean;
    appendChannelActions(...actions: ChannelAction<any>[]): this;
    removeChannelActions(...actions: ChannelAction<any>[]): this;
    getPriority(): number;
    setPriority(P: number): this;
    getParentOfAllenRelationships(): CCBLAllenInterface[];
    getReferedByAllenRelationships(): CCBLAllenInterface[];
    getContainingStateContext(): CCBLContextStateAny | undefined;
}