import { CCBLProgramWorker } from "./ccbl-exec";
import { getWorkerP } from "./ccbl-browser-data";
const url = new URL('./ccbl-node-worker.js', import.meta.url);
export function getCCBLProgramForBrowser() {
    const WP = getWorkerP(url);
    return new CCBLProgramWorker(WP);
}
//# sourceMappingURL=ccbl-browser.js.map