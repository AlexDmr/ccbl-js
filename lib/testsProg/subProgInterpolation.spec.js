"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const EmitterValue_1 = require("../EmitterValue");
const subProgInterpolation_1 = require("./subProgInterpolation");
describe("subProgInterpolation::", () => {
    const clock = new Clock_1.CCBLTestClock();
    const prog = new ProgramObject_1.CCBLProgramObject("subProgInterpolation", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const N = new EmitterValue_1.CCBLEmitterValue(0);
    sourceEnv.register_CCBLEmitterValue("N", N);
    it("prog and its copy should be equivalent", () => {
        const cpProg = ProgramObjectInterface_1.copyHumanReadableProgram(subProgInterpolation_1.subProgInterpolation);
        expect(ProgramObjectInterface_1.progEquivalent(subProgInterpolation_1.subProgInterpolation, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(subProgInterpolation_1.subProgInterpolation, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(subProgInterpolation_1.subProgInterpolation, seri, false)).toBe(true);
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