"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Channel_1 = require("../Channel");
const EmitterValue_1 = require("../EmitterValue");
const Event_1 = require("../Event");
const subProgramMapping2_1 = require("./subProgramMapping2");
describe("subProgMappings::Load and compare", () => {
    const clock = new Clock_1.CCBLTestClock();
    const prog = new ProgramObject_1.CCBLProgramObject("subProgMapping2", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const R = Channel_1.getNewChannel(0);
    const G = Channel_1.getNewChannel(0);
    const B = Channel_1.getNewChannel(0);
    const lamp = Channel_1.getNewChannel('');
    const temp = new EmitterValue_1.CCBLEmitterValue(0);
    const presenceAlice = new EmitterValue_1.CCBLEmitterValue(false);
    const presenceBob = new EmitterValue_1.CCBLEmitterValue(false);
    const bt1 = new Event_1.CCBLEvent({ eventName: "bt1", env: sourceEnv, expressionFilter: "" });
    const bt2 = new Event_1.CCBLEvent({ eventName: "bt2", env: sourceEnv, expressionFilter: "" });
    sourceEnv.register_Channel("R", R);
    sourceEnv.register_Channel("G", G);
    sourceEnv.register_Channel("B", B);
    sourceEnv.register_Channel("lamp", lamp);
    sourceEnv.register_CCBLEmitterValue("temp", temp);
    sourceEnv.register_CCBLEmitterValue("presenceAlice", presenceAlice);
    sourceEnv.register_CCBLEmitterValue("presenceBob", presenceBob);
    sourceEnv.registerCCBLEvent("bt1", bt1);
    sourceEnv.registerCCBLEvent("bt2", bt2);
    it("prog and its copy should be equivalent", () => {
        const cpProg = ProgramObjectInterface_1.copyHumanReadableProgram(subProgramMapping2_1.subProgMapping2);
        expect(ProgramObjectInterface_1.progEquivalent(subProgramMapping2_1.subProgMapping2, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(subProgramMapping2_1.subProgMapping2, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(subProgramMapping2_1.subProgMapping2, seri, false)).toBe(true);
    });
    it("Clock nextForeseenUpdate should be undefined", () => {
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("Loading should be OK and channels value", () => {
        clock.goto(0);
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(0);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
    it("@t1000, oscillo1.val should equal 0", () => {
        clock.goto(1000);
        presenceAlice.set(true);
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(0);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
    it("@t1500, oscillo1.val should equal 0", () => {
        clock.goto(1500);
        bt1.trigger({ value: false });
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(0);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
    it("@t2000, oscillo1.val should equal 0", () => {
        clock.goto(2000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(127.5);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
});
//# sourceMappingURL=subProgramMapping2.spec.js.map