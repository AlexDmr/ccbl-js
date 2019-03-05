import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContext } from "./Context";
import { CCBLContextStateAny } from "./ContextState";
export declare class CCBLAllenDuring extends CCBLAllen {
    parent: CCBLContextStateAny;
    children: CCBLContext[];
    constructor(parent?: CCBLContextStateAny, children?: CCBLContext[]);
    getAllenType(): AllenType;
    setParent(parent: CCBLContextStateAny): this;
    private CB_active;
}
export declare function initDuring(): void;
