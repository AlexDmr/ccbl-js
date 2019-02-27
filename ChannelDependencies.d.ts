import { CCBLEmitterValueInterface } from "./EmitterValueInterface";
export declare type EXPR = {
    expression: string;
    varsIds: string[];
};
export declare type EMITTER = CCBLEmitterValueInterface<any>;
export declare type EXPRESSION = CCBLEmitterValueInterface<any>;
export declare function getAllDependencies(emitter: EMITTER): EMITTER[];
export declare function updateDependencies(emitter: EMITTER, expression: EXPRESSION, dependencies: EMITTER[]): void;
