import { WorkerP } from './ccbl-exec-data';
import { AlxWorker } from './ccbl-alx-worker';
export declare class AlxWorkerBrowser implements AlxWorker {
    private _url;
    private W;
    get url(): string | URL;
    readonly isOnline: Promise<true>;
    constructor(_url: string | URL);
    postMessage(message: any): void;
    addEventListener(listener: (ev: any) => void): void;
    removeEventListener(listener: (ev: any) => void): void;
    terminate(): void;
}
export declare function getWorkerP<PM, PR>(url: string | URL): WorkerP<PM, PR>;
