import { CCBLTestClock } from "../Clock";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { commitStateActions } from "../Channel";
import { NoEventDuringNsec } from "./NoEventDuringNseconds";
import { CCBLEmitterValue } from "../EmitterValue";
import { CCBLEvent } from "../Event";
describe("Concurrency Test", () => {
    let clock = new CCBLTestClock();
    let rootProg = new CCBLProgramObject("rootProg", clock);
    let sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => commitStateActions(), true);
    const E = new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    it('should have correct initial values', () => {
        sourceEnv.register_CCBLEmitterValue("N", new CCBLEmitterValue(1000));
        sourceEnv.register_CCBLEmitterValue("Vin", new CCBLEmitterValue(true));
        sourceEnv.register_CCBLEmitterValue("Vout", new CCBLEmitterValue(false));
        sourceEnv.registerCCBLEvent("E", E);
        rootProg.loadHumanReadableProgram(NoEventDuringNsec, sourceEnv, {});
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