"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const progInitPb_1 = require("./progInitPb");
const EmitterValue_1 = require("../EmitterValue");
describe("progInitPb", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("progInitPb", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const A = new EmitterValue_1.CCBLEmitterValue(0);
    const B = new EmitterValue_1.CCBLEmitterValue(1);
    sourceEnv.register_CCBLEmitterValue("A", A);
    sourceEnv.register_CCBLEmitterValue("B", B);
    it("should be equivalent to its serialisation", () => {
        rootProg.loadHumanReadableProgram(progInitPb_1.progInitPb, sourceEnv, {});
        const P = rootProg.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(P, progInitPb_1.progInitPb, false)).toEqual(true);
    });
    it("should load with correct values", () => {
        rootProg.activate();
        rootProg.UpdateChannelsActions();
        const Cs = rootProg.getValue('Cs');
        const Cn = rootProg.getValue('Cn');
        expect(Cs).toEqual("inside");
        expect(Cn).toEqual(1);
        expect(rootProg.getValue("LOG")).toEqual("IN");
    });
    it("clock.nextForeseenUpdate should be equal to 1111", () => {
        expect(clock.nextForeseenUpdate).toEqual(1111);
        expect(rootProg.getValue("LOG")).toEqual("IN");
    });
    it("@500 : Cs == 'inside'", () => {
        clock.goto(500);
        rootProg.UpdateChannelsActions();
        const Cs = rootProg.getValue('Cs');
        expect(Cs).toEqual("inside");
        expect(rootProg.getValue("LOG")).toEqual("IN");
        expect(clock.nextForeseenUpdate).toEqual(1111);
    });
    it("@1500 : Cs == 'outside'", () => {
        clock.goto(1500);
        rootProg.UpdateChannelsActions();
        const Cs = rootProg.getValue('Cs');
        expect(Cs).toEqual("outside");
        const Cn = rootProg.getValue('Cn');
        expect(Cn).toEqual(1);
        expect(rootProg.getValue("LOG")).toEqual("OUT");
    });
});
//# sourceMappingURL=progInitPb.spec.js.map