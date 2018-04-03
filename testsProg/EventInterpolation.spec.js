"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramObject_1 = require("../ProgramObject");
const Channel_1 = require("../Channel");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Clock_1 = require("../Clock");
const EventInterpolation_1 = require("./EventInterpolation");
const Event_1 = require("../Event");
describe("Ev Interpolation", () => {
    let clock = new Clock_1.CCBLTestClock();
    let rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    let sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    clock.onChange(() => Channel_1.commitStateActions(), true);
    let resetVolume = new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("resetVolume", resetVolume);
    it('should have correct initial values', () => {
        rootProg.loadHumanReadableProgram(EventInterpolation_1.EventInterpolation, sourceEnv, {});
        rootProg.activate();
        clock.goto(0);
        expect(rootProg.getValue('Volume')).toEqual(0);
    });
    it('should trigger', () => {
        resetVolume.trigger({ value: 'press' });
        expect(rootProg.getValue('Volume')).toEqual(0);
        clock.goto(20);
        expect(rootProg.getValue('Volume')).toEqual(20);
        clock.goto(60);
        expect(rootProg.getValue('Volume')).toEqual(60);
        clock.goto(100);
        expect(rootProg.getValue('Volume')).toEqual(100);
        clock.goto(200);
        expect(rootProg.getValue('Volume')).toEqual(100);
    });
});
//# sourceMappingURL=EventInterpolation.spec.js.map