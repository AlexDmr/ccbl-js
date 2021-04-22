import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram, progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { getNewChannel } from "../Channel";
import { CCBLEmitterValue } from "../EmitterValue";
import { Hysteresis } from "./Hysteresis";
describe("Hysteresis::", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("Hysteresis", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const chauffage = getNewChannel(false);
    const temp = new CCBLEmitterValue(0);
    sourceEnv.register_Channel("chauffage", chauffage);
    sourceEnv.register_CCBLEmitterValue("temp", temp);
    it("prog and its copy should be equivalent", () => {
        const cpProg = copyHumanReadableProgram(Hysteresis);
        expect(progEquivalent(Hysteresis, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(Hysteresis, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(progEquivalent(Hysteresis, seri, false)).toBe(true);
    });
    it("@0: Heating", () => {
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("chauffage")).toEqual(true);
    });
    it("@1000: temp = 17 => Heating", () => {
        clock.goto(1000);
        temp.set(17);
        prog.UpdateChannelsActions();
        expect(prog.getValue("chauffage")).toEqual(true);
    });
    it("@2000: temp = 23 => Heating", () => {
        clock.goto(2000);
        temp.set(23);
        prog.UpdateChannelsActions();
        expect(prog.getValue("chauffage")).toEqual(false);
    });
});
//# sourceMappingURL=Hysteresis.spec.js.map