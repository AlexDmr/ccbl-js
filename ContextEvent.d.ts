import { CCBLContext } from "./Context";
import { CCBLEventInterface, CCBL_EventJSON } from "./EventInterface";
import { CCBLAllenJSON } from "./Allen";
import { ChannelActionJSON } from "./ChannelAction";
export declare type CCBLContextEventJSON = {
    type: string;
    event: CCBL_EventJSON;
    parentOfAllenRelationships: CCBLAllenJSON[];
    channelActions: ChannelActionJSON[];
    activable: boolean;
};
export declare class CCBLContextEvent extends CCBLContext {
    event: CCBLEventInterface<any>;
    constructor(event: CCBLEventInterface<any>);
    toJSON(): CCBLContextEventJSON;
    setActivable(value?: boolean): this;
}
