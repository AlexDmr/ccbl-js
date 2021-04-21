import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContextStateAny, CCBLContextStateEndWith } from "./ContextState";
export declare class CCBLAllenEndWith extends CCBLAllen {
    parent: CCBLContextStateAny | undefined;
    children: CCBLContextStateEndWith[];
    constructor(parent: CCBLContextStateAny | undefined, children?: CCBLContextStateEndWith[]);
    getAllenType(): AllenType;
    setParent(parent: CCBLContextStateAny | undefined): this;
    private CB_active;
}
export declare function initEndWith(): void;
