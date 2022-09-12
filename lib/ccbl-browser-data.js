import { WorkerP } from './ccbl-exec-data';
export class AlxWorkerBrowser {
    constructor(_url) {
        this._url = _url;
        this._url = typeof this._url === "string" ? new URL(_url, import.meta.url) : this._url;
        this.W = new Worker(this._url);
    }
    get url() { return this._url; }
    postMessage(message) {
        this.W.postMessage(message);
    }
    addEventListener(listener) {
        this.W.addEventListener("message", listener);
    }
    removeEventListener(listener) {
        this.W.removeEventListener("message", listener);
    }
    terminate() {
        this.W.terminate();
    }
}
export function getWorkerP(url) {
    const W = new AlxWorkerBrowser(url);
    return new WorkerP(W);
}
//# sourceMappingURL=ccbl-browser-data.js.map