import { WorkerP } from './ccbl-exec-data';
export class AlxWorkerBrowser {
    constructor(_url) {
        this._url = _url;
        this.W = new Worker(new URL(_url, window.location.origin));
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