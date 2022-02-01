import { AllenType } from "./AllenInterface";
import { CCBLAllen } from "./Allen";
import { CCBLContext } from "./Context";
import { CCBLContextStateAny } from "./ContextState";
export declare class CCBLAllenDuring extends CCBLAllen {
    parent: CCBLContextStateAny | undefined;
    children: CCBLContext[];
    constructor(parent?: CCBLContextStateAny | undefined, children?: CCBLContext[]);
    getAllenType(): AllenType;
    setParent(parent: CCBLContextStateAny | undefined): this;
    private CB_active;
}
export declare function initDuring(): void;
