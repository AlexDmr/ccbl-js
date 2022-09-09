import { CCBLContext } from "./Context";
import { CCBLEventInterface, CCBL_EventJSON } from "./EventInterface";
import { CCBLAllenJSON } from "./Allen";
import { ChannelActionJSON } from "./ChannelAction";
import { ChannelActionEventInterface } from "./ChannelActionStateEventInterface";
export declare type CCBLContextEventJSON = {
    type: string;
    event: CCBL_EventJSON;
    parentOfAllenRelationships: CCBLAllenJSON[];
    channelActions: ChannelActionJSON[];
    activable: boolean;
    contextName: string;
};
export declare class CCBLContextEvent extends CCBLContext {
    event: CCBLEventInterface<any>;
    private actualCbJsonDirty;
    protected contextName: string;
    readonly id: string;
    constructor(contextName: string, event: CCBLEventInterface<any>);
    dispose(): void;
    toJSON(): CCBLContextEventJSON;
    getType(): "CCBLContextState" | "CCBLContextEvent";
    getChannelActionEvents(): ChannelActionEventInterface[];
    setActivable(value?: boolean): this;
}
export declare function initContextEvent(): void;
