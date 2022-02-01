import { MathJsStatic, MathNode } from "mathjs";
import { HumanReadableStateContext, HumanReadableProgram, HumanReadableStateAction, ContextOrProgram } from "./ProgramObjectInterface";
export declare const mathjs: MathJsStatic;
export interface SMTscript {
    script: string;
    ids: string[];
}
export interface ContextSMTDescr {
    context: HumanReadableStateContext;
    channelDependencies: string[];
    satisfaisable: string;
    réfutable: string;
    actOnChannels: string[];
}
export interface ExpressionSMT {
    dependencies: string[];
    SMT: string;
}
export declare function getContextStateSMT(P: HumanReadableProgram, C: HumanReadableStateContext): ContextSMTDescr;
export declare function getContextSMTdescrFromProg(P: HumanReadableProgram): string;
export declare function getActionsSMT(P: HumanReadableProgram, actions: HumanReadableStateAction[]): string;
export declare function canActivateAndDesactivate(P: HumanReadableProgram, C: HumanReadableStateContext, ancestorActions: HumanReadableStateAction[]): string;
export declare function getStateContextsFrom(L: ContextOrProgram[]): HumanReadableStateContext[];
export declare function getProgramDeclarations(P: HumanReadableProgram): string;
export declare function getSMTExpr(P: HumanReadableProgram, expr: string): ExpressionSMT;
export declare function getSMTforContext(P: HumanReadableProgram, C: HumanReadableStateContext): SMTscript;
export declare function getSMT(P: HumanReadableProgram): string;
export declare function mathNodeToSMT(P: HumanReadableProgram, node: MathNode): string;
