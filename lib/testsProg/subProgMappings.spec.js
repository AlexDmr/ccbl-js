"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Channel_1 = require("../Channel");
const EmitterValue_1 = require("../EmitterValue");
const Event_1 = require("../Event");
const subProgMappings_1 = require("./subProgMappings");
describe("subProgMappings::Load and compare", () => {
    const clock = new Clock_1.CCBLTestClock();
    const prog = new ProgramObject_1.CCBLProgramObject("subProgMappings", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const C1 = Channel_1.getNewChannel(0);
    const C2 = Channel_1.getNewChannel(0);
    const A = new EmitterValue_1.CCBLEmitterValue(0);
    const B = new EmitterValue_1.CCBLEmitterValue(0);
    const evt1 = new Event_1.CCBLEvent({ eventName: "evt1", env: sourceEnv, expressionFilter: "" });
    sourceEnv.register_Channel("C1", C1);
    sourceEnv.register_Channel("C2", C2);
    sourceEnv.register_CCBLEmitterValue("A", A);
    sourceEnv.register_CCBLEmitterValue("B", B);
    sourceEnv.registerCCBLEvent("evt1", evt1);
    it("prog and its copy should be equivalent", () => {
        const cpProg = ProgramObjectInterface_1.copyHumanReadableProgram(subProgMappings_1.parentProg);
        expect(ProgramObjectInterface_1.progEquivalent(subProgMappings_1.parentProg, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(subProgMappings_1.parentProg, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(subProgMappings_1.parentProg, seri, false)).toBe(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        clock.goto(0);
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.val")).toEqual(0);
    });
    it("@t1000, oscillo1.val should equal 0", () => {
        clock.goto(1000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.val")).toEqual(0);
        expect(prog.getValue("oscillo1.log")).toEqual("root");
    });
    it("@t2000, bt triggered, oscillo1.val should equal 0", () => {
        clock.goto(2000);
        evt1.trigger({ value: 0 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.val")).toEqual(0);
        expect(prog.getValue("oscillo1.log")).toEqual("Up");
    });
    it("@t2500, oscillo1.val should equal 50", () => {
        clock.goto(2500);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Up");
        expect(prog.getValue("oscillo1.val")).toEqual(50);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3000, oscillo1.val should equal 50", () => {
        clock.goto(3000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Down");
        expect(prog.getValue("oscillo1.val")).toEqual(100);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3500, oscillo1.val should equal 50", () => {
        clock.goto(3500);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Down");
        expect(prog.getValue("oscillo1.val")).toEqual(50);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3600, bt triggered but value < 0 => Nothing new", () => {
        clock.goto(3600);
        evt1.trigger({ value: -2 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Down");
        expect(prog.getValue("oscillo1.val")).toEqual(40);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3700, bt triggered => exit oscillations", () => {
        clock.goto(3700);
        evt1.trigger({ value: 2 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("root");
        expect(prog.getValue("oscillo1.val")).toEqual(0);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
});
//# sourceMappingURL=subProgMappings.spec.js.map