import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContextStateAny, CCBLContextStateEndWith, CCBLContextStateStartWith } from "./ContextState";
import { CCBLContextInterface } from "./ContextInterface";
export declare class CCBLAllenMeet extends CCBLAllen {
    parent: CCBLContextStateEndWith;
    children: CCBLContextStateStartWith[];
    private ancestor;
    private lookingForAncestor;
    private parentWasActive;
    constructor(parent: CCBLContextStateEndWith, children?: CCBLContextStateStartWith[]);
    getAllenType(): AllenType;
    setParent(parent: CCBLContextStateAny): this;
    appendChildren(...children: CCBLContextStateAny[]): this;
    getAncestor(): ANCESTOR_MEET;
    private CB_active;
}
export declare type ANCESTOR_MEET = {
    containingContext: CCBLContextStateAny;
    firstMeetContext: CCBLContextInterface;
    allenType: AllenType;
};
