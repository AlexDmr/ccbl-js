"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramObject_1 = require("../ProgramObject");
const Channel_1 = require("../Channel");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Clock_1 = require("../Clock");
const MultipleTimers_1 = require("./MultipleTimers");
describe("Concurrency Test", () => {
    let clock = new Clock_1.CCBLTestClock();
    let rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    let sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    clock.onChange(() => Channel_1.commitStateActions(), true);
    it('should have correct initial values', () => {
        rootProg.loadHumanReadableProgram(MultipleTimers_1.Concurrency, sourceEnv, {});
        rootProg.activate();
        clock.goto(0);
        expect(rootProg.getValue('N')).toEqual(0);
    });
    it('should scale', () => {
        clock.goto(10);
        expect(rootProg.getValue('N')).toEqual(2);
        clock.goto(20);
        expect(rootProg.getValue('N')).toEqual(4);
        clock.goto(100);
        expect(rootProg.getValue('N')).toEqual(20);
        clock.goto(110);
        expect(rootProg.getValue('N')).toEqual(22);
        clock.goto(120);
        expect(rootProg.getValue('N')).toEqual(24);
        clock.goto(130);
        expect(rootProg.getValue('N')).toEqual(26);
        clock.goto(140);
        expect(rootProg.getValue('N')).toEqual(28);
        clock.goto(150);
        expect(rootProg.getValue('N')).toEqual(30);
        clock.goto(160);
        expect(rootProg.getValue('N')).toEqual(32);
        clock.goto(200);
        expect(rootProg.getValue('N')).toEqual(40);
        clock.goto(210);
        expect(rootProg.getValue('N')).toEqual(42);
        clock.goto(300);
        expect(rootProg.getValue('N')).toEqual(60);
    });
});
//# sourceMappingURL=MultipleTimers.spec.js.map