import { CCBLProgramObject } from "../ProgramObject";
import { commitStateActions } from "../Channel";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLTestClock } from "../Clock";
import { CCBLEvent } from "../Event";
import { MultipleEvents } from "./MultipleEvents";
describe("Multiple Events", () => {
    let clock = new CCBLTestClock();
    let rootProg = new CCBLProgramObject("rootProg", clock);
    let sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => commitStateActions(), true);
    let resetVolume = new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    let muteVolume = new CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    let moreTest = new CCBLEvent({
        eventName: "moreTest",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("resetVolume", resetVolume);
    sourceEnv.registerCCBLEvent("muteVolume", muteVolume);
    sourceEnv.registerCCBLEvent("moreTest", moreTest);
    it('should have correct initial values', () => {
        rootProg.loadHumanReadableProgram(MultipleEvents, sourceEnv, {});
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