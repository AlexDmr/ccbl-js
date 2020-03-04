import { CCBLEnvironmentExecutionInterface } from "./ExecutionEnvironmentInterface";
export declare type CCBL_Serialisation = {
    type: string;
};
export declare type FCT_Unserialization = (json: CCBL_Serialisation, env: CCBLEnvironmentExecutionInterface) => Object;
export declare function registerUnserializer(id: string, fct: FCT_Unserialization): void;
export declare function Unserialize(json: CCBL_Serialisation, env: CCBLEnvironmentExecutionInterface): any;
export declare function DisplayDeepEqual(json1: CCBL_Serialisation, json2: CCBL_Serialisation, dec?: string): void;
