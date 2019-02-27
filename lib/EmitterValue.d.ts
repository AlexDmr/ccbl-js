import { CCBLEmitter } from "./Emitter";
import { CCBLEmitterValueInterface, CCBLEmitterValueJSON } from "./EmitterValueInterface";
export declare type configCCBLEmitterValue = {
    constant?: boolean;
    id?: string;
};
export declare class CCBLEmitterValue<T> extends CCBLEmitter<T> implements CCBLEmitterValueInterface<T> {
    private value;
    private emitterAvailability;
    private id;
    private constant;
    private available;
    constructor(value: T, config?: configCCBLEmitterValue);
    dispose(): void;
    toJSON(): CCBLEmitterValueJSON;
    isAvailable(): boolean;
    setIsAvailable(available: boolean): this;
    onAvailabilityChange(cb: (availability: boolean) => void): this;
    offAvailabilityChange(cb: (availability: boolean) => void): this;
    get(): T;
    set(v: T): this;
    get_Id(): string;
}
