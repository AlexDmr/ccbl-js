import { CCBLContextInterface } from "./ContextInterface";
export declare type FCT_CONTEXT_ORDER = (root: CCBLContextInterface, priority?: number, doneContexts?: CCBLContextInterface[]) => number | undefined;
export declare let StructuralOrder: FCT_CONTEXT_ORDER;
