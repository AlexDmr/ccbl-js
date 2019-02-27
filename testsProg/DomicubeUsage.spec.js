"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const EmitterValue_1 = require("../EmitterValue");
const Channel_1 = require("../Channel");
const Event_1 = require("../Event");
const DomicubeUsage_1 = require("./DomicubeUsage");
describe("The Domicube Plus", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    clock.onChange(() => Channel_1.commitStateActions(), true);
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
        rootProg.loadHumanReadableProgram(DomicubeUsage_1.domicubePlus, sourceEnv, {});
        acc.set({ x: 10, y: 10, z: 10 });
        gyro.set({ alpha: 0, beta: 0, gamma: 0 });
        rootProg.activate();
        Channel_1.commitStateActions();
        expect(rootProg.getValue("Volume")).toEqual(0);
        expect(rootProg.getValue("rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual(`unknown`);
    });
    it("acc={x: 9.81, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=1000 => Init 'timer'", () => {
        acc.set({ x: 9.81, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(1000);
        expect(rootProg.getValue("Volume")).toEqual(0);
        expect(rootProg.getValue("rotation")).toEqual("clockwise");
        expect(rootProg.getValue("face")).toEqual(1);
        expect(rootProg.getValue("log")).toEqual("IncreaseVolume");
        expect(rootProg.getValue("N")).toEqual(1);
    });
    it("clock=1005 => N=1 and Volume=0", () => {
        clock.goto(1005);
        expect(rootProg.getValue("Volume")).toEqual(0);
        expect(rootProg.getValue("N")).toEqual(1);
    });
    it("clock=1010 => Volume=1", () => {
        clock.goto(1010);
        expect(rootProg.getValue("Volume")).toEqual(1);
        expect(rootProg.getValue("N")).toEqual(2);
    });
    it("clock=1020 => Volume=2", () => {
        clock.goto(1020);
        expect(rootProg.getValue("Volume")).toEqual(2);
        expect(rootProg.getValue("N")).toEqual(3);
    });
    it("clock=1030 => Volume=3", () => {
        clock.goto(1030);
        expect(rootProg.getValue("Volume")).toEqual(3);
        expect(rootProg.getValue("N")).toEqual(4);
    });
    it("clock=1060 => Volume=6", () => {
        clock.goto(1060);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("N")).toEqual(7);
    });
    it("clock=1065, acc=0, gyro=0 => Volume=6, root level", () => {
        acc.set({ x: 0, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(1065);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("log")).toEqual("at root level");
        expect(rootProg.getValue("N")).toEqual(7);
        expect(rootProg.getValue("DomicubeBase__face")).toEqual("unknown");
        expect(rootProg.getValue("DomicubeBase__rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual("unknown");
        expect(rootProg.getValue("rotation")).toEqual("none");
    });
    it("clock=1100, acc=0, gyro=0 => Volume=6, root level", () => {
        clock.goto(1100);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("N")).toEqual(7);
        expect(rootProg.getValue("log")).toEqual("at root level");
    });
});
//# sourceMappingURL=DomicubeUsage.spec.js.map