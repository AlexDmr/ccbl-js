import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram, progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { subProgInterpolation } from "./subProgInterpolation";
describe("subProgInterpolation::", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("subProgInterpolation", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const N = new CCBLEmitterValue(0);
    sourceEnv.register_CCBLEmitterValue("N", N);
    it("prog and its copy should be equivalent", () => {
        const cpProg = copyHumanReadableProgram(subProgInterpolation);
        expect(progEquivalent(subProgInterpolation, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(subProgInterpolation, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(progEquivalent(subProgInterpolation, seri, false)).toBe(true);
    });
    it("Clock nextForeseenUpdate should be undefined", () => {
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("activate => nextForeseenUpdate should stay undefined", () => {
        prog.activate();
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("desactivate => nextForeseenUpdate is undefined", () => {
        prog.activate(false);
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("N = 200 => nextForeseenUpdate is undefined", () => {
        N.set(200);
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("activate => nextForeseenUpdate becomes 1000", () => {
        prog.activate();
        expect(clock.nextForeseenUpdate).toEqual(1000);
    });
    it("desactivate => nextForeseenUpdate is undefined", () => {
        prog.activate(false);
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
});
//# sourceMappingURL=subProgInterpolation.spec.js.map