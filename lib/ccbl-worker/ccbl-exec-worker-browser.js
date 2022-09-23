export function getWorkerComm() {
    const W = {
        emit: (msg) => {
            postMessage(msg);
        },
        subscribe: (cb) => {
            onmessage = (M) => cb(M.data);
        }
    };
    return W;
}
//# sourceMappingURL=ccbl-exec-worker-browser.js.map