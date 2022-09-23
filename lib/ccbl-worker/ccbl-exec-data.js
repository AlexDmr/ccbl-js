export class WorkerP {
    constructor(worker) {
        this.worker = worker;
        this.mapMsg = new Map();
        this.idMsg = 0;
    }
    dispose() {
        this.mapMsg.clear();
    }
    postMessage(value) {
        const msg = {
            idMsg: ++this.idMsg,
            msg: value
        };
        this.worker.postMessage(msg);
    }
    async promisePost(m) {
        return new Promise((resolve, reject) => {
            const mft = {
                idMsg: ++this.idMsg,
                msg: m
            };
            const cb = (msgR) => {
                if (msgR.idMsg === mft.idMsg) {
                    switch (msgR.type) {
                        case "ok":
                            resolve(msgR.res);
                            break;
                        case "error":
                        default:
                            reject(msgR.res);
                            break;
                    }
                    this.worker.removeEventListener(cb);
                }
            };
            this.worker.addEventListener(cb);
            this.worker.postMessage(mft);
        });
    }
    addEventListener(listenerOK, listenerError) {
        const cb_OK = (M) => {
            if (M.type === "ok") {
                listenerOK(M.res);
            }
        };
        const Lcb = [cb_OK];
        this.worker.addEventListener(cb_OK);
        if (listenerError) {
            const cbErr = (M) => { if (M.type === "error")
                listenerError(M.res); };
            this.worker.addEventListener(cbErr);
            Lcb.push(cbErr);
        }
        return {
            Lcb,
            unsubscribe: () => {
                for (const cb of Lcb) {
                    this.worker.removeEventListener(cb);
                }
            }
        };
    }
}
//# sourceMappingURL=ccbl-exec-data.js.map