import { MathJsStatic, MathNode } from "mathjs";
import { HumanReadableStateContext, HumanReadableProgram } from "./ProgramObjectInterface";
export interface SMTscript {
    script: string;
    ids: string[];
}
export interface ContextDependencies {
    context: HumanReadableStateContext;
    parent: ContextDependencies;
    variables: string[];
}
export declare function F(P: HumanReadableProgram, C: HumanReadableStateContext): {
    context: HumanReadableStateContext;
    satisfaisable: string;
    réfutable: string;
};
export declare const mathjs: Partial<MathJsStatic>;
export declare function getSMTExpr(P: HumanReadableProgram, expr: string): string;
export declare function getSMTforContext(P: HumanReadableProgram, C: HumanReadableStateContext): SMTscript;
export declare function getSMT(P: HumanReadableProgram): string;
export declare function mathNodeToSMT(P: HumanReadableProgram, node: MathNode): string;
