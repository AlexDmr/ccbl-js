import { CCBLContext, CCBLContextJSON } from "./Context";
import { AllenType, CCBLAllenInterface } from "./AllenInterface";
import { CCBLContextInterface } from "./ContextInterface";
export declare function getAllenTypeName(rel: AllenType): string | undefined;
export declare type CCBLAllenJSON = {
    type: string;
    children: CCBLContextJSON[];
};
export declare abstract class CCBLAllen implements CCBLAllenInterface {
    parent: CCBLContext | undefined;
    children: CCBLContext[];
    protected jsonDirty: boolean;
    protected lastJSON: CCBLAllenJSON | undefined;
    constructor(parent: CCBLContext | undefined, children?: CCBLContext[]);
    dispose(): void;
    abstract getAllenType(): AllenType;
    getParent(): CCBLContextInterface | undefined;
    setParent(parent: CCBLContext | undefined): this;
    setChildren(children: CCBLContext[]): this;
    appendChildren(...children: CCBLContext[]): this;
    getChildren(): CCBLContext[];
    setJsonDirty(): this;
    toJSON(): CCBLAllenJSON;
}
