import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContextStateAny, CCBLContextStateEndWith } from "./ContextState";
export declare class CCBLAllenEndWith extends CCBLAllen {
    parent: CCBLContextStateAny;
    children: CCBLContextStateEndWith[];
    constructor(parent: CCBLContextStateAny, children?: CCBLContextStateEndWith[]);
    getAllenType(): AllenType;
}
export declare function initEndWith(): void;
