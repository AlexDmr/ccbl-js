import { initCCBL } from "../main";
import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram, progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { commitStateActions } from "../Channel";
import { childProg, rootProg } from "./rootProgLoadUnload";
import { AllenType } from "../AllenInterface";
initCCBL();
describe("loadUnload:: Loading of programs:", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const E = new CCBLEmitterValue(false);
    sourceEnv.register_CCBLEmitterValue("E", E);
    it("Initiale values are OK for rootProg", () => {
        prog.loadHumanReadableProgram(rootProg, sourceEnv, {});
        prog.activate();
        commitStateActions();
        expect(prog.getValue("E")).toBe(false);
        expect(prog.getValue("C")).toBe(0);
        expect(progEquivalent(rootProg, prog.toHumanReadableProgram(), false)).toBe(true);
    });
    it("loads correctly subprogram childProg", () => {
        prog.appendSubProgram("childProg", childProg);
        const expectedP = {
            ...rootProg,
            subPrograms: {
                childProg: childProg
            }
        };
        expect(progEquivalent(expectedP, prog.toHumanReadableProgram(), false)).toBe(true);
        expect(prog.getValue("E")).toBe(false);
        expect(prog.getValue("C")).toBe(0);
    });
    it("E becomes true => C = 5", () => {
        E.set(true);
        commitStateActions();
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(5);
    });
    it("instanciate correctly childProg under subProgRootFirst", () => {
        prog.plugSubProgramAs({
            programId: "childProg",
            as: "childProg1",
            allen: AllenType.During,
            hostContextName: "subProgRootFirst",
            mapInputs: {}
        });
        commitStateActions();
        const expectedP = {
            ...copyHumanReadableProgram(rootProg),
            subPrograms: {
                childProg: childProg
            }
        };
        expectedP.allen.During[0].allen = {
            During: [{
                    programId: "childProg",
                    as: "childProg1",
                    mapInputs: {}
                }]
        };
        const actualP = prog.toHumanReadableProgram();
        expect(progEquivalent(expectedP, actualP, false)).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(5);
    });
    it("instanciate correctly childProg under subProgRootLast", () => {
        prog.plugSubProgramAs({
            programId: "childProg",
            as: "childProg2",
            allen: AllenType.During,
            hostContextName: "subProgRootLast",
            mapInputs: {}
        });
        commitStateActions();
        const expectedP = {
            ...copyHumanReadableProgram(rootProg),
            subPrograms: {
                childProg: childProg
            }
        };
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
        const equivalent = progEquivalent(expectedP, actualP, false);
        expect(equivalent).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(100);
    });
    it("uninstanciate correctly childProg1", () => {
        prog.unplugSubProgramInstance("childProg1");
        commitStateActions();
        const actualP = prog.toHumanReadableProgram();
        const expectedP = {
            ...actualP,
            subPrograms: {
                childProg: childProg
            }
        };
        expectedP.allen = {
            During: [...expectedP.allen.During]
        };
        expectedP.allen.During[2] = { ...expectedP.allen.During[2] };
        expectedP.allen.During[2].allen = {
            During: [{
                    programId: "childProg",
                    as: "childProg2",
                    mapInputs: {}
                }]
        };
        expect(progEquivalent(expectedP, actualP, false)).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(100);
    });
    it("uninstanciate correctly all childProg and childProg itself", () => {
        prog.removeSubProgram("childProg");
        commitStateActions();
        const actualP = prog.toHumanReadableProgram();
        const expectedP = {
            ...actualP,
            subPrograms: {}
        };
        expect(progEquivalent(expectedP, actualP, false)).toBe(true);
        expect(prog.getValue("E")).toBe(true);
        expect(prog.getValue("C")).toBe(5);
    });
});
//# sourceMappingURL=loadUnload.spec.js.map