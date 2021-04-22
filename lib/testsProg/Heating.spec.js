import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram, progEquivalent, ProgramsEquivalents, allenEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { getNewChannel } from "../Channel";
import { CCBLEmitterValue } from "../EmitterValue";
import { progHouse } from "./Heating";
describe("Heating::", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("progHouse", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const Eve = new CCBLEmitterValue({ location: 'Home' });
    const tempOutside = new CCBLEmitterValue(0);
    sourceEnv.register_CCBLEmitterValue("Eve", Eve);
    sourceEnv.register_CCBLEmitterValue("tempOutside", tempOutside);
    const Avatar = getNewChannel('red');
    const openWindows = getNewChannel(false);
    const Heating = getNewChannel(false);
    const tempInside = getNewChannel(20);
    sourceEnv.register_Channel("Avatar", Avatar);
    sourceEnv.register_Channel("openWindows", openWindows);
    sourceEnv.register_Channel("Heating", Heating);
    sourceEnv.register_Channel("tempInside", tempInside);
    let CP;
    it("prog and its copy should be equivalent", () => {
        const cpProg = CP = copyHumanReadableProgram(progHouse);
        expect(progEquivalent(progHouse, cpProg)).toEqual(true);
    });
    it("allen equivalents", () => {
        expect(allenEquivalent(progHouse.allen, CP.allen, false)).toBe(true);
    });
    it("subPrograms equivalents", () => {
        console.log(progHouse.subPrograms, CP.subPrograms);
        expect(ProgramsEquivalents(progHouse.subPrograms, CP.subPrograms, false)).toBe(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(progHouse, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(ProgramsEquivalents(progHouse.subPrograms, seri.subPrograms, false)).toBe(true);
    });
    it("@0: tempInside = 20 && not Heating", () => {
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("tempInside")).toEqual(20);
        expect(prog.getValue("Heating")).toEqual(false);
    });
    it("@1000: tempInside = 19 && not Heating", () => {
        clock.goto(1000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("tempInside")).toEqual(19);
        expect(prog.getValue("Heating")).toEqual(false);
    });
    it("@2000: tempInside = 18 && not Heating", () => {
        clock.goto(2000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("tempInside")).toEqual(18);
        expect(prog.getValue("Heating")).toEqual(false);
    });
    it("@3000: tempInside = 17 && Heating", () => {
        clock.goto(3000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("tempInside")).toEqual(17);
        expect(prog.getValue("Heating")).toEqual(true);
    });
});
//# sourceMappingURL=Heating.spec.js.map