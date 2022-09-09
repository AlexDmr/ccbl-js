import { getCCBLProgramForBrowser } from "./ccbl-browser";
describe("ccbl-browser-worker::basic", () => {
    let PW;
    it("should be possible to init a CCBL worker for browser", () => {
        PW = getCCBLProgramForBrowser();
        expect(PW).toBeDefined();
    });
});
//# sourceMappingURL=ccbl-browser-worker.MARF.js.map