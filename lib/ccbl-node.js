import { getWorkerP } from "./ccbl-node-data";
import { CCBLProgramWorker } from "./ccbl-exec";
const url = new URL('./ccbl-node-worker.js', import.meta.url);
export function getCCBLProgramForNode() {
    const WP = getWorkerP(url);
    return new CCBLProgramWorker(WP);
}
//# sourceMappingURL=ccbl-node.js.map