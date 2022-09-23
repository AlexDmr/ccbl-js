export interface AlxWorker {
    readonly isOnline: Promise<true>;
    postMessage(message: any): void;
    addEventListener(listener: (ev: any) => void): void;
    removeEventListener(listener: (ev: any) => void): void;
    terminate(): void;
}
