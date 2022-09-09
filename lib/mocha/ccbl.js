import { CCBLTestClock } from "../Clock";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { commitStateActions, getNewChannel } from "../Channel";
import { CCBLEvent } from "../Event";
import { domicube } from "../testsProg/domicube";
import { initCCBL } from "../main";
import { strict as assert } from 'assert';
import { getCCBLProgramForNode } from "../ccbl-node";
describe("Domicube", () => {
    describe("Local version", () => {
        initCCBL();
        const clock = new CCBLTestClock();
        const rootProg = new CCBLProgramObject("rootProg", clock);
        const sourceEnv = new CCBLEnvironmentExecution(clock);
        const gyro = new CCBLEmitterValue({ alpha: 0, beta: 0, gamma: 0 });
        const acc = new CCBLEmitterValue({ x: 0, y: 100, z: 0 });
        const lampAvatar = getNewChannel(undefined);
        const btToggleAvatarOnOff = new CCBLEvent({
            eventName: "btToggleAvatarOnOff",
            expressionFilter: "",
            env: sourceEnv
        });
        sourceEnv.register_CCBLEmitterValue("gyro", gyro);
        sourceEnv.register_CCBLEmitterValue("acc", acc);
        sourceEnv.register_Channel("lampAvatar", lampAvatar);
        sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", btToggleAvatarOnOff);
        it("should have the correct initial values", () => {
            rootProg.loadHumanReadableProgram(domicube, sourceEnv, {});
            acc.set({ x: 10, y: 20, z: 20 });
            gyro.set({ alpha: 0, beta: 0, gamma: 0 });
            rootProg.activate();
            commitStateActions();
            let tmp;
            assert.equal(tmp = rootProg.getValue("R"), 0);
            assert.equal(tmp = rootProg.getValue("accNorm"), 30);
            assert.equal(tmp = rootProg.getValue("rotation"), "none");
            assert.equal(tmp = rootProg.getValue("face"), `unknown`);
        });
        it("acc={x: 9.81, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=1000 => Init 'timer'", () => {
            acc.set({ x: 9.81, y: 0, z: 0 });
            gyro.set({ alpha: 1, beta: 0, gamma: 0 });
            clock.goto(1000);
            commitStateActions();
            assert.equal(rootProg.getValue("movingFast"), false);
            assert.equal(rootProg.getValue("G"), 9.81);
            assert.equal(rootProg.getValue("accNorm"), 9.81);
            assert.equal(rootProg.getValue("R"), 1);
            assert.equal(rootProg.getValue("rotation"), "clockwise");
            assert.equal(rootProg.getValue("face"), 1);
        });
        it("acc={x: 0, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=2000 => R=0, face unknown", () => {
            acc.set({ x: 0, y: 0, z: 0 });
            gyro.set({ alpha: 1, beta: 0, gamma: 0 });
            clock.goto(2000);
            commitStateActions();
            assert.equal(rootProg.getValue("movingFast"), true);
            assert.equal(rootProg.getValue("accNorm"), 0);
            assert.equal(rootProg.getValue("R"), 0);
            assert.equal(rootProg.getValue("rotation"), "none");
            assert.equal(rootProg.getValue("face"), `unknown`);
        });
    });
    describe("Worker version (browser? Node?)", () => {
        let ccblW;
        it("should be possible to getCCBLProgramForBrowser", () => {
            ccblW = getCCBLProgramForNode("file:///C:/Recherche/CCBL/CCBLEngineTS/build_ES2020_ES2020/nf/");
            assert.equal(ccblW === undefined, false);
        });
    });
});
//# sourceMappingURL=ccbl.js.map