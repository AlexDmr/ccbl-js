"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Channel_1 = require("../Channel");
const EmitterValue_1 = require("../EmitterValue");
const Heating_1 = require("./Heating");
describe("Heating::", () => {
    const clock = new Clock_1.CCBLTestClock();
    const prog = new ProgramObject_1.CCBLProgramObject("progHouse", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const Eve = new EmitterValue_1.CCBLEmitterValue({ location: 'Home' });
    const tempOutside = new EmitterValue_1.CCBLEmitterValue(0);
    sourceEnv.register_CCBLEmitterValue("Eve", Eve);
    sourceEnv.register_CCBLEmitterValue("tempOutside", tempOutside);
    const Avatar = Channel_1.getNewChannel('red');
    const openWindows = Channel_1.getNewChannel(false);
    const Heating = Channel_1.getNewChannel(false);
    const tempInside = Channel_1.getNewChannel(20);
    sourceEnv.register_Channel("Avatar", Avatar);
    sourceEnv.register_Channel("openWindows", openWindows);
    sourceEnv.register_Channel("Heating", Heating);
    sourceEnv.register_Channel("tempInside", tempInside);
    let CP;
    it("prog and its copy should be equivalent", () => {
        const cpProg = CP = ProgramObjectInterface_1.copyHumanReadableProgram(Heating_1.progHouse);
        expect(ProgramObjectInterface_1.progEquivalent(Heating_1.progHouse, cpProg)).toEqual(true);
    });
    it("allen equivalents", () => {
        expect(ProgramObjectInterface_1.allenEquivalent(Heating_1.progHouse.allen, CP.allen, false)).toBe(true);
    });
    it("subPrograms equivalents", () => {
        console.log(Heating_1.progHouse.subPrograms, CP.subPrograms);
        expect(ProgramObjectInterface_1.ProgramsEquivalents(Heating_1.progHouse.subPrograms, CP.subPrograms, false)).toBe(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(Heating_1.progHouse, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.ProgramsEquivalents(Heating_1.progHouse.subPrograms, seri.subPrograms, false)).toBe(true);
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