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
    const lampAvatar = Channel_1.getNewChannel(undefined);
    const btToggleAvatarOnOff = new Event_1.CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("gyro", gyro);
    sourceEnv.register_CCBLEmitterValue("acc", acc);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", btToggleAvatarOnOff);
    const resetVolume = new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("resetVolume", resetVolume);
    const muteVolume = new Event_1.CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("muteVolume", muteVolume);
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
        let tmp;
        expect(tmp = rootProg.getValue('DomicubeBase.isOn')).toEqual(true);
        expect(tmp = rootProg.getValue("Volume")).toEqual(0);
        expect(tmp = rootProg.getValue("rotation")).toEqual("clockwise");
        expect(tmp = rootProg.getValue("face")).toEqual(1);
        expect(tmp = rootProg.getValue("log")).toEqual("IncreaseVolume");
        expect(tmp = rootProg.getValue("N")).toEqual(1);
    });
    it("clock=1005 => N=1 and Volume=0", () => {
        acc.set({ x: 9.82, y: 0, z: 0 });
        clock.goto(1005);
        expect(rootProg.getValue("Volume")).toEqual(0);
        expect(rootProg.getValue("N")).toEqual(1);
    });
    it("clock=1010 => Volume=1", () => {
        acc.set({ x: 9.83, y: 0, z: 0 });
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
        acc.set({ x: 9.833, y: 0, z: 0 });
        acc.set({ x: 9.832, y: 0, z: 0 });
        acc.set({ x: 9.831, y: 0, z: 0 });
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
        expect(rootProg.getValue("DomicubeBase.face")).toEqual("unknown");
        expect(rootProg.getValue("DomicubeBase.rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual("unknown");
        expect(rootProg.getValue("rotation")).toEqual("none");
    });
    it("clock=1100, acc=0, gyro=0 => Volume=6, root level", () => {
        clock.goto(1100);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("N")).toEqual(7);
        expect(rootProg.getValue("log")).toEqual("at root level");
    });
    it('should reset the volume', () => {
        clock.goto(1200);
        resetVolume.trigger({ value: 'press' });
        Channel_1.commitStateActions();
        expect(rootProg.getValue('Volume')).toEqual(6);
        clock.goto(1220);
        expect(rootProg.getValue('Volume')).toEqual(24.8);
        clock.goto(1260);
        expect(rootProg.getValue('Volume')).toEqual(62.4);
        clock.goto(1300);
        expect(rootProg.getValue('Volume')).toEqual(100);
        clock.goto(1350);
        expect(rootProg.getValue('Volume')).toEqual(100);
    });
    it('should change channel', function () {
        clock.goto(1400);
        expect(rootProg.getValue('Channel')).toEqual(1);
        gyro.set({ alpha: 0, beta: 1, gamma: 0 });
        acc.set({ x: 0, y: 9.81, z: 0 });
        Channel_1.commitStateActions();
        expect(rootProg.getValue('Channel')).toEqual(1);
        expect(rootProg.getValue('log')).toEqual("IncreaseChannel");
        clock.goto(1450);
        expect(rootProg.getValue('Channel')).toEqual(6);
    });
});
//# sourceMappingURL=DomicubeUsage.spec.js.map