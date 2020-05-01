"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Channel_1 = require("../Channel");
const EmitterValue_1 = require("../EmitterValue");
const Hysteresis_1 = require("./Hysteresis");
describe("Hysteresis::", () => {
    const clock = new Clock_1.CCBLTestClock();
    const prog = new ProgramObject_1.CCBLProgramObject("Hysteresis", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const chauffage = Channel_1.getNewChannel(false);
    const temp = new EmitterValue_1.CCBLEmitterValue(0);
    sourceEnv.register_Channel("chauffage", chauffage);
    sourceEnv.register_CCBLEmitterValue("temp", temp);
    it("prog and its copy should be equivalent", () => {
        const cpProg = ProgramObjectInterface_1.copyHumanReadableProgram(Hysteresis_1.Hysteresis);
        expect(ProgramObjectInterface_1.progEquivalent(Hysteresis_1.Hysteresis, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(Hysteresis_1.Hysteresis, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(Hysteresis_1.Hysteresis, seri, false)).toBe(true);
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