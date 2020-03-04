"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Channel_1 = require("../Channel");
const NoEventDuringNseconds_1 = require("./NoEventDuringNseconds");
const EmitterValue_1 = require("../EmitterValue");
const Event_1 = require("../Event");
describe("Concurrency Test", () => {
    let clock = new Clock_1.CCBLTestClock();
    let rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    let sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    clock.onChange(() => Channel_1.commitStateActions(), true);
    const E = new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    it('should have correct initial values', () => {
        sourceEnv.register_CCBLEmitterValue("N", new EmitterValue_1.CCBLEmitterValue(1000));
        sourceEnv.register_CCBLEmitterValue("Vin", new EmitterValue_1.CCBLEmitterValue(true));
        sourceEnv.register_CCBLEmitterValue("Vout", new EmitterValue_1.CCBLEmitterValue(false));
        sourceEnv.registerCCBLEvent("E", E);
        rootProg.loadHumanReadableProgram(NoEventDuringNseconds_1.NoEventDuringNsec, sourceEnv, {});
        rootProg.activate();
        clock.goto(0);
        expect(rootProg.getValue("Vin")).toBe(true);
        expect(rootProg.getValue("Vout")).toBe(false);
        expect(rootProg.getValue("V")).toBe(false);
    });
    it('at 500 state is the same', () => {
        clock.goto(500);
        expect(rootProg.getValue("Vin")).toBe(true);
        expect(rootProg.getValue("Vout")).toBe(false);
        expect(rootProg.getValue("V")).toBe(false);
    });
    it('at 1000, E, so V becomes true', () => {
        E.trigger({ value: true });
        clock.goto(1000);
        expect(rootProg.getValue("V")).toBe(true);
    });
    it('at 1499, V is still true', () => {
        clock.goto(1499);
        expect(rootProg.getValue("V")).toBe(true);
    });
    it('at 1500, V becomes false', () => {
        clock.goto(1500);
        expect(rootProg.getValue("V")).toBe(false);
    });
    it('at 2000, E => V becomes true', () => {
        clock.goto(2000);
        E.trigger({ value: true });
        clock.goto(2001);
        expect(rootProg.getValue("V")).toBe(true);
    });
    it('at 2500, E => V becomes true', () => {
        clock.goto(2500);
        E.trigger({ value: true });
        expect(rootProg.getValue("V")).toBe(true);
    });
    it('at 2999, E => V still true', () => {
        clock.goto(2999);
        expect(rootProg.getValue("V")).toBe(true);
    });
    it('at 3000, E => V still true', () => {
        clock.goto(3000);
        expect(rootProg.getValue("V")).toBe(true);
    });
    it('at 3499, E => V still true', () => {
        clock.goto(3499);
        expect(rootProg.getValue("V")).toBe(true);
    });
});
//# sourceMappingURL=NoEventDuringNseconds.spec.js.map