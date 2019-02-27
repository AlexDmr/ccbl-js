"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const EmitterValue_1 = require("../EmitterValue");
const Channel_1 = require("../Channel");
const Event_1 = require("../Event");
const domicube_1 = require("./domicube");
describe("Domicube", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const gyro = new EmitterValue_1.CCBLEmitterValue({ alpha: 0, beta: 0, gamma: 0 });
    const acc = new EmitterValue_1.CCBLEmitterValue({ x: 0, y: 100, z: 0 });
    const lampAvatar = Channel_1.getNewChannel();
    const btToggleAvatarOnOff = new Event_1.CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("gyro", gyro);
    sourceEnv.register_CCBLEmitterValue("acc", acc);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", btToggleAvatarOnOff);
    it("should have the correct initial values", () => {
        rootProg.loadHumanReadableProgram(domicube_1.domicube, sourceEnv, {});
        acc.set({ x: 10, y: 20, z: 20 });
        gyro.set({ alpha: 0, beta: 0, gamma: 0 });
        rootProg.activate();
        Channel_1.commitStateActions();
        expect(rootProg.getValue("R")).toEqual(0);
        expect(rootProg.getValue("accNorm")).toEqual(30);
        expect(rootProg.getValue("rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual(`unknown`);
    });
    it("acc={x: 9.81, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=1000 => Init 'timer'", () => {
        acc.set({ x: 9.81, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(1000);
        Channel_1.commitStateActions();
        expect(rootProg.getValue("movingFast")).toEqual(false);
        expect(rootProg.getValue("G")).toEqual(9.81);
        expect(rootProg.getValue("accNorm")).toEqual(9.81);
        expect(rootProg.getValue("R")).toEqual(1);
        expect(rootProg.getValue("rotation")).toEqual("clockwise");
        expect(rootProg.getValue("face")).toEqual(1);
    });
    it("acc={x: 0, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=2000 => R=0, face unknown", () => {
        acc.set({ x: 0, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(2000);
        Channel_1.commitStateActions();
        expect(rootProg.getValue("movingFast")).toEqual(true);
        expect(rootProg.getValue("accNorm")).toEqual(0);
        expect(rootProg.getValue("R")).toEqual(0);
        expect(rootProg.getValue("rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual(`unknown`);
    });
});
//# sourceMappingURL=domicube.spec.js.map