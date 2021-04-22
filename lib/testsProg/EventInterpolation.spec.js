import { CCBLProgramObject } from "../ProgramObject";
import { commitStateActions } from "../Channel";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLTestClock } from "../Clock";
import { EventInterpolation } from "./EventInterpolation";
import { CCBLEvent } from "../Event";
describe("Ev Interpolation", () => {
    let clock = new CCBLTestClock();
    let rootProg = new CCBLProgramObject("rootProg", clock);
    let sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => commitStateActions(), true);
    let resetVolume = new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("resetVolume", resetVolume);
    it('should have correct initial values', () => {
        rootProg.loadHumanReadableProgram(EventInterpolation, sourceEnv, {});
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