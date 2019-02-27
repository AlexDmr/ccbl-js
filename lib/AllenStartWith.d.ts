import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContextStateAny, CCBLContextStateStartWith } from "./ContextState";
export declare class CCBLAllenStartWith extends CCBLAllen {
    parent: CCBLContextStateAny;
    children: CCBLContextStateStartWith[];
    constructor(parent: CCBLContextStateAny, children?: CCBLContextStateStartWith[]);
    getAllenType(): AllenType;
    setParent(parent: CCBLContextStateAny): this;
    private CB_active;
}
