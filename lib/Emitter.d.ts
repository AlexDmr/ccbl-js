export declare type CB_CCBLEmitter<T> = (data: T) => void;
export interface CCBLEmitterInterface<T> {
    on(cb: (data: T) => void): this;
    off(cb: (data: T) => void): this;
    emit(evt: T): this;
}
export declare class CCBLEmitter<T> implements CCBLEmitterInterface<T> {
    private cbs;
    dispose(): void;
    once(cb: CB_CCBLEmitter<T>): this;
    on(cb: CB_CCBLEmitter<T>): this;
    off(cb: CB_CCBLEmitter<T>): this;
    emit(evt: T): this;
}
