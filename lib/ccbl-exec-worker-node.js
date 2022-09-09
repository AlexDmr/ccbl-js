import { parentPort } from 'worker_threads';
export function getWorkerComm() {
    const W = {
        emit: (msg) => {
            parentPort?.postMessage(msg);
        },
        subscribe: (cb) => {
            parentPort?.addListener("message", cb);
        }
    };
    return W;
}
//# sourceMappingURL=ccbl-exec-worker-node.js.map