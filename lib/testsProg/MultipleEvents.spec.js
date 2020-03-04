"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramObject_1 = require("../ProgramObject");
const Channel_1 = require("../Channel");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Clock_1 = require("../Clock");
const Event_1 = require("../Event");
const MultipleEvents_1 = require("./MultipleEvents");
describe("Multiple Events", () => {
    let clock = new Clock_1.CCBLTestClock();
    let rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    let sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    clock.onChange(() => Channel_1.commitStateActions(), true);
    let resetVolume = new Event_1.CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    let muteVolume = new Event_1.CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    let moreTest = new Event_1.CCBLEvent({
        eventName: "moreTest",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("resetVolume", resetVolume);
    sourceEnv.registerCCBLEvent("muteVolume", muteVolume);
    sourceEnv.registerCCBLEvent("moreTest", moreTest);
    it('should have correct initial values', () => {
        rootProg.loadHumanReadableProgram(MultipleEvents_1.MultipleEvents, sourceEnv, {});
        rootProg.activate();
        clock.goto(0);
        expect(rootProg.getValue('N')).toEqual(0);
    });
    it('should scale', () => {
        resetVolume.trigger({ value: 'press' });
        clock.goto(10);
        expect(rootProg.getValue('N')).toEqual(10);
        clock.goto(20);
        expect(rootProg.getValue('N')).toEqual(20);
        clock.goto(100);
        expect(rootProg.getValue('N')).toEqual(100);
        clock.goto(110);
        expect(rootProg.getValue('N')).toEqual(100);
        clock.goto(200);
    });
    it('should mute', function () {
        muteVolume.trigger({ value: 'press' });
        expect(rootProg.getValue('N')).toEqual(-1);
    });
    it('should more test', function () {
        moreTest.trigger({ value: 'test' });
        expect(rootProg.getValue('N')).toEqual(50);
    });
});
//# sourceMappingURL=MultipleEvents.spec.js.map