import { CCBLProgramWorker } from "./ccbl-exec";
import { getWorkerP } from "./ccbl-browser-data";
const url = './base/ts/nf/ccbl-browser-worker.js';
export function getCCBLProgramForBrowser() {
    const WP = getWorkerP(url);
    return new CCBLProgramWorker(WP);
}
//# sourceMappingURL=ccbl-browser.js.map