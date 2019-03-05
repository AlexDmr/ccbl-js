import { CCBLEmitterInterface } from "./Emitter";
export declare type CCBLEmitterValueJSON = {
    available: boolean;
    type: string;
    id: string;
    constant: boolean;
    initialValue: any;
    value: any;
};
export interface CCBLEmitterValueInterface<T> extends CCBLEmitterInterface<T> {
    toJSON(): CCBLEmitterValueJSON;
    get(): T;
    set(v: T): this;
    get_Id(): string;
    isAvailable(): boolean;
    setIsAvailable(available: boolean): this;
    onAvailabilityChange(cb: (availability: boolean) => void): this;
    offAvailabilityChange(cb: (availability: boolean) => void): this;
    dispose(): any;
}
