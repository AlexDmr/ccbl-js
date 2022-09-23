import { CCBLTestClock } from "../Clock";
import { progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { commitStateActions, getNewChannel } from "../Channel";
import { pgTestDomus } from "../../server/programs/pgTestDomus";
describe("pgTestDomus", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => commitStateActions(), true);
    const dLivingroomLight1 = getNewChannel(0);
    const dLivingroomLight2 = getNewChannel(0);
    const Buttons6BathroomMiddleRight = new CCBLEmitterValue(0);
    const nTempLivingroom = new CCBLEmitterValue(20);
    const nHydroLivingroom = new CCBLEmitterValue(50);
    const nCo2Livingroom = new CCBLEmitterValue(500);
    const dKitchenLight1 = new CCBLEmitterValue(0);
    const dKitchenLight2 = new CCBLEmitterValue(0);
    const sKitchenLight3 = new CCBLEmitterValue(false);
    sourceEnv.register_Channel("dLivingroomLight1", dLivingroomLight1);
    sourceEnv.register_Channel("dLivingroomLight2", dLivingroomLight2);
    sourceEnv.register_CCBLEmitterValue("Buttons6BathroomMiddleRight", Buttons6BathroomMiddleRight);
    sourceEnv.register_CCBLEmitterValue("gnTempLivingroomyro", nTempLivingroom);
    sourceEnv.register_CCBLEmitterValue("nHydroLivingroom", nHydroLivingroom);
    sourceEnv.register_CCBLEmitterValue("nCo2Livingroom", nCo2Livingroom);
    sourceEnv.register_CCBLEmitterValue("dKitchenLight1", dKitchenLight1);
    sourceEnv.register_CCBLEmitterValue("dKitchenLight2", dKitchenLight2);
    sourceEnv.register_CCBLEmitterValue("sKitchenLight3", sKitchenLight3);
    it("should be able to load", () => {
        try {
            rootProg.loadHumanReadableProgram(pgTestDomus, sourceEnv, {});
            const P = rootProg.toHumanReadableProgram();
            expect(progEquivalent(pgTestDomus, P, false)).toEqual(true);
        }
        catch (err) {
            fail(`Error while loading pgTestDomus: ${err}`);
        }
        rootProg.activate();
        commitStateActions();
        expect(rootProg.getValue("N")).toEqual(3000);
    });
});
//# sourceMappingURL=pgDomusTest01.spec.js.map