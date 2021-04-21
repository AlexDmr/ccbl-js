import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContextStateAny, CCBLContextStateStartWith } from "./ContextState";
export declare class CCBLAllenStartWith extends CCBLAllen {
    parent: CCBLContextStateAny | undefined;
    children: CCBLContextStateStartWith[];
    constructor(parent: CCBLContextStateAny | undefined, children?: CCBLContextStateStartWith[]);
    getAllenType(): AllenType;
    setParent(parent: CCBLContextStateAny | undefined): this;
    private CB_active;
}
export declare function initStartWith(): void;
