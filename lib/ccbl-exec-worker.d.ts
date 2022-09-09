export interface WorkerComm<OM, PM> {
    emit(msg: PM): void;
    subscribe(cb: (msg: OM) => void): void;
}
