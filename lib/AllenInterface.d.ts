import { CCBLContextInterface, CCBLContextJSON } from "./ContextInterface";
import { CCBLContext } from "./Context";
export declare enum AllenType {
    During = 0,
    StartWith = 1,
    EndWith = 2,
    After = 3,
    Meet = 4
}
export declare type CCBLAllenJSON = {
    type: string;
    children: CCBLContextJSON[];
};
export interface CCBLAllenInterface {
    dispose(): any;
    getAllenType(): AllenType;
    getParent(): CCBLContextInterface;
    setParent(parent: CCBLContextInterface): this;
    appendChildren(...children: CCBLContext[]): this;
    getChildren(): CCBLContextInterface[];
    toJSON(): CCBLAllenJSON;
    setJsonDirty(): this;
}
