import { getWorkerP } from "./ccbl-node-data";
import { CCBLProgramWorker } from "./ccbl-exec";
const url = './ccbl-node-worker.js';
export function getCCBLProgramForNode(base) {
    const WP = getWorkerP(url, base);
    return new CCBLProgramWorker(WP);
}
//# sourceMappingURL=ccbl-node.js.map