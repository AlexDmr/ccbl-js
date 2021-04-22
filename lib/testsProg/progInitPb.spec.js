import { CCBLTestClock } from "../Clock";
import { progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { progInitPb } from "./progInitPb";
import { CCBLEmitterValue } from "../EmitterValue";
describe("progInitPb", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("progInitPb", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const A = new CCBLEmitterValue(0);
    const B = new CCBLEmitterValue(1);
    sourceEnv.register_CCBLEmitterValue("A", A);
    sourceEnv.register_CCBLEmitterValue("B", B);
    it("should be equivalent to its serialisation", () => {
        rootProg.loadHumanReadableProgram(progInitPb, sourceEnv, {});
        const P = rootProg.toHumanReadableProgram();
        expect(progEquivalent(P, progInitPb, false)).toEqual(true);
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