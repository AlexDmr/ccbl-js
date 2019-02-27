import { CCBLContext, CCBLContextJSON } from "./Context";
import { AllenType, CCBLAllenInterface } from "./AllenInterface";
import { CCBLContextInterface } from "./ContextInterface";
export declare function getAllenTypeName(rel: AllenType): string;
export declare type CCBLAllenJSON = {
    type: string;
    children: CCBLContextJSON[];
};
export declare class CCBLAllen implements CCBLAllenInterface {
    parent: CCBLContext;
    children: CCBLContext[];
    protected jsonDirty: boolean;
    protected lastJSON: CCBLAllenJSON;
    constructor(parent: CCBLContext, children?: CCBLContext[]);
    dispose(): void;
    getAllenType(): AllenType;
    getParent(): CCBLContextInterface;
    setParent(parent: CCBLContext): this;
    setChildren(children: CCBLContext[]): this;
    appendChildren(...children: CCBLContext[]): this;
    getChildren(): CCBLContext[];
    setJsonDirty(): this;
    toJSON(): CCBLAllenJSON;
}
