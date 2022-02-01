import { ChannelActionJSON } from "./ChannelAction";
import { CCBLAllenInterface, CCBLAllenJSON } from "./AllenInterface";
import { ChannelActionInterface } from "./ChannelActionStateEventInterface";
export declare type CCBLContextJSON = {
    type: string;
    parentOfAllenRelationships: CCBLAllenJSON[];
    channelActions: ChannelActionJSON[];
    activable: boolean;
    contextName: string;
};
export interface CCBLContextInterface {
    dispose(): any;
    toJSON(): CCBLContextJSON;
    getParentOfAllenRelationships(): CCBLAllenInterface[];
    appendParentOfAllenRelationships(...allens: CCBLAllenInterface[]): this;
    removeParentOfAllenRelationships(...allens: CCBLAllenInterface[]): this;
    appendReferedByAllenRelationships(...allens: CCBLAllenInterface[]): this;
    removeReferedByAllenRelationships(...allens: CCBLAllenInterface[]): this;
    getActivable(): boolean;
    setActivable(value: boolean): this;
    getActive(): boolean;
    appendChannelActions(...actions: ChannelActionInterface[]): this;
    removeChannelActions(...actions: ChannelActionInterface[]): this;
    getPriority(): number;
    setPriority(P: number): this;
    getType(): string;
}
