import { Worker } from 'worker_threads';
import { WorkerP } from './ccbl-exec-data';
class AlxWorkerNode {
    constructor(_url) {
        this._url = _url;
        this._url = typeof this._url === "string" ? new URL(_url, import.meta.url) : this._url;
        this.W = new Worker(this._url);
        this.W.addListener("error", err => console.error("Worker error", err));
        this.W.addListener("messageerror", err => console.error("Worker messageerror", err));
        this.isOnline = new Promise((resolve, reject) => {
            this.W.addListener("online", () => resolve(true));
            this.W.addListener("exit", code => {
                console.error("Worker exit code", code);
                reject(code);
            });
        });
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
export async function getWorkerP(url) {
    const W = new AlxWorkerNode(url);
    await W.isOnline;
    return new WorkerP(W);
}
//# sourceMappingURL=ccbl-node-data.js.map