import { CCBLTestClock } from "../../../Clock";
import { CcblProgramElements_to_JSON, getInstance, progEquivalent } from "../../../ProgramObjectInterface";
import { CCBLProgramObject } from "../../../ProgramObject";
import { CCBLEnvironmentExecution } from "../../../ExecutionEnvironment";
import { CCBLEmitterValue } from "../../../EmitterValue";
import { getNewChannel } from "../../../Channel";
import { pgTestDomus } from "./pgTestDomus";
describe("pgTestDomus", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => rootProg.UpdateChannelsActions(), true);
    const dLivingroomLight1 = getNewChannel(0);
    const dLivingroomLight2 = getNewChannel(0);
    const dKitchenLight1 = getNewChannel(0);
    const dKitchenLight2 = getNewChannel(0);
    const Buttons6BathroomMiddleRight = new CCBLEmitterValue(0);
    const nTempLivingroom = new CCBLEmitterValue(20);
    const nHydroLivingroom = new CCBLEmitterValue(50);
    const nCo2Livingroom = new CCBLEmitterValue(500);
    const sKitchenLight3 = new CCBLEmitterValue(false);
    sourceEnv.register_Channel("dLivingroomLight1", dLivingroomLight1);
    sourceEnv.register_Channel("dLivingroomLight2", dLivingroomLight2);
    sourceEnv.register_Channel("dKitchenLight1", dKitchenLight1);
    sourceEnv.register_Channel("dKitchenLight2", dKitchenLight2);
    sourceEnv.register_CCBLEmitterValue("Buttons6BathroomMiddleRight", Buttons6BathroomMiddleRight);
    sourceEnv.register_CCBLEmitterValue("nTempLivingroom", nTempLivingroom);
    sourceEnv.register_CCBLEmitterValue("nHydroLivingroom", nHydroLivingroom);
    sourceEnv.register_CCBLEmitterValue("nCo2Livingroom", nCo2Livingroom);
    sourceEnv.register_CCBLEmitterValue("sKitchenLight3", sKitchenLight3);
    let elements;
    it("should be able to load the program", () => {
        try {
            rootProg.loadHumanReadableProgram(pgTestDomus, sourceEnv, {});
            const P = rootProg.toHumanReadableProgram();
            expect(progEquivalent(pgTestDomus, P, false)).withContext("pgTestDomus is equivalent to its serialization").toEqual(true);
        }
        catch (err) {
            fail(`Error while loading pgTestDomus: ${err}`);
        }
        rootProg.activate();
        clock.goto(1000);
        expect(rootProg.getValue("dLivingroomLight1")).toEqual(0);
        expect(rootProg.getValue("dLivingroomLight2")).toEqual(100);
        expect(rootProg.getValue("dKitchenLight1")).toEqual(0);
        expect(rootProg.getValue("dKitchenLight2")).toEqual(0);
        clock.goto(4000);
        expect(rootProg.getValue("dLivingroomLight1")).toEqual(100);
        expect(rootProg.getValue("dLivingroomLight2")).toEqual(0);
        expect(rootProg.getValue("dKitchenLight1")).toEqual(0);
        expect(rootProg.getValue("dKitchenLight2")).toEqual(0);
    });
    it("should be able to identify subprograms instances based on path", () => {
        elements = CcblProgramElements_to_JSON(rootProg.getCcblElements());
        console.log("elements", elements);
        const pg2 = getInstance(["root", "expé_2_kitchen"], elements);
        const pg1 = getInstance(["root", "expé_2_kitchen"], elements);
        expect(pg2).withContext("expé_2_kitchen should be defined").toBeDefined();
        expect(pg1).withContext("expé_1_livingroom should be defined").toBeDefined();
        console.log("pg1", pg1);
        expect(pg1[pg1.length - 1].elements.program).withContext("expé_1_livingroom should expose a program elements attribute").toBeDefined();
    });
    it(`should be able to identify root instances based on path ["root"]`, () => {
        const root = getInstance(["root"], elements);
        expect(root).toBeDefined();
        console.log("root", root);
    });
});
//# sourceMappingURL=pgDomusTest01.spec.js.map