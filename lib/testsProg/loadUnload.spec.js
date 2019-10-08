"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const EmitterValue_1 = require("../EmitterValue");
const Channel_1 = require("../Channel");
const rootProgLoadUnload_1 = require("./rootProgLoadUnload");
const AllenInterface_1 = require("../AllenInterface");
main_1.initCCBL();
describe("ProgramObject: Loading of programs:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const prog = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const E = new EmitterValue_1.CCBLEmitterValue(false);
    sourceEnv.register_CCBLEmitterValue("E", E);
    it("Initiale values are OK for rootProg", () => {
        prog.loadHumanReadableProgram(rootProgLoadUnload_1.rootProg, sourceEnv, {});
        prog.activate();
        Channel_1.commitStateActions();
        expect(prog.getValue("E")).toBe(false);
        expect(prog.getValue("C")).toBe(0);
        expect(ProgramObjectInterface_1.progEquivalent(rootProgLoadUnload_1.rootProg, prog.toHumanReadableProgram())).toBe(true);
    });
    it("loads correctly subprogram childProg", () => {
        prog.appendSubProgram("childProg", rootProgLoadUnload_1.childProg);
        const expectedP = Object.assign(Object.assign({}, rootProgLoadUnload_1.rootProg), { subPrograms: {
                childProg: rootProgLoadUnload_1.childProg
            } });
        expect(ProgramObjectInterface_1.progEquivalent(expectedP, prog.toHumanReadableProgram())).toBe(true);
        expect(prog.getValue("E")).toBe(false);
        expect(prog.getValue("C")).toBe(0);
    });
    it("E becomes true => C = 5", () => {
        E.set(true);
        Channel_1.commitStateActions();
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(5);
    });
    it("instanciate correctly childProg under subProgRootFirst", () => {
        prog.plugSubProgramAs({
            programId: "childProg",
            as: "childProg1",
            allen: AllenInterface_1.AllenType.During,
            hostContextName: "subProgRootFirst",
            mapInputs: {}
        });
        Channel_1.commitStateActions();
        const expectedP = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(rootProgLoadUnload_1.rootProg))), { subPrograms: {
                childProg: rootProgLoadUnload_1.childProg
            } });
        expectedP.allen.During[0].allen = {
            During: [{
                    programId: "childProg",
                    as: "childProg1",
                    mapInputs: {}
                }]
        };
        const actualP = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(expectedP, actualP)).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(5);
    });
    it("instanciate correctly childProg under subProgRootLast", () => {
        prog.plugSubProgramAs({
            programId: "childProg",
            as: "childProg2",
            allen: AllenInterface_1.AllenType.During,
            hostContextName: "subProgRootLast",
            mapInputs: {}
        });
        Channel_1.commitStateActions();
        const expectedP = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(rootProgLoadUnload_1.rootProg))), { subPrograms: {
                childProg: rootProgLoadUnload_1.childProg
            } });
        expectedP.allen.During[0].allen = {
            During: [{
                    programId: "childProg",
                    as: "childProg1",
                    mapInputs: {}
                }]
        };
        expectedP.allen.During[2].allen = {
            During: [{
                    programId: "childProg",
                    as: "childProg2",
                    mapInputs: {}
                }]
        };
        const actualP = prog.toHumanReadableProgram();
        const equivalent = ProgramObjectInterface_1.progEquivalent(expectedP, actualP);
        expect(equivalent).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(100);
    });
    it("uninstanciate correctly childProg1", () => {
        prog.unplugSubProgramInstance("childProg1");
        Channel_1.commitStateActions();
        const expectedP = Object.assign(Object.assign({}, JSON.parse(JSON.stringify(rootProgLoadUnload_1.rootProg))), { subPrograms: {
                childProg: rootProgLoadUnload_1.childProg
            } });
        expectedP.allen.During[2].allen = {
            During: [{
                    programId: "childProg",
                    as: "childProg2",
                    mapInputs: {}
                }]
        };
        const actualP = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(expectedP, actualP)).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(100);
    });
    it("uninstanciate correctly all childProg and childProg itself", () => {
        prog.removeSubProgram("childProg");
        Channel_1.commitStateActions();
        const expectedP = rootProgLoadUnload_1.rootProg;
        const actualP = prog.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(expectedP, actualP)).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(5);
    });
});
//# sourceMappingURL=loadUnload.spec.js.map