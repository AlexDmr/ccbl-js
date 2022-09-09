import { Worker } from 'worker_threads';
import { WorkerP } from './ccbl-exec-data';
class AlxWorkerNode {
    constructor(_url, base) {
        this._url = _url;
        this.W = new Worker(new URL(_url, base ?? import.meta.url));
        this.W.addListener("error", err => console.error("Worker error", err));
        this.W.addListener("messageerror", err => console.error("Worker messageerror", err));
        this.W.addListener("exit", code => console.error("Worker exit code", code));
    }
    get url() { return this._url; }
    postMessage(message) {
        this.W.postMessage(message);
    }
    addEventListener(listener) {
        this.W.addListener("message", listener);
    }
    removeEventListener(listener) {
        this.W.removeListener("message", listener);
    }
    terminate() {
        this.W.terminate();
    }
}
export function getWorkerP(url, base) {
    const W = new AlxWorkerNode(url, base);
    return new WorkerP(W);
}
//# sourceMappingURL=ccbl-node-data.js.map