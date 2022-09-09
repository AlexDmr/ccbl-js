import { CCBLTestClock } from "../Clock";
import { progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { commitStateActions, getNewChannel } from "../Channel";
import { rootProgAvatar } from "./rootProgAvatar";
describe("rootProgAvatar", () => {
    const clock = new CCBLTestClock();
    const rootProgAvatarCCBL = new CCBLProgramObject("rootProgAvatar", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const lampAvatar = getNewChannel("");
    const BobAtHome = new CCBLEmitterValue(false);
    const AliceAtHome = new CCBLEmitterValue(false);
    const AliceAtBobHome = new CCBLEmitterValue(false);
    const AliceAvailable = new CCBLEmitterValue(false);
    const securityMode = new CCBLEmitterValue(false);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.register_CCBLEmitterValue("BobAtHome", BobAtHome);
    sourceEnv.register_CCBLEmitterValue("AliceAtHome", AliceAtHome);
    sourceEnv.register_CCBLEmitterValue("AliceAtBobHome", AliceAtBobHome);
    sourceEnv.register_CCBLEmitterValue("AliceAvailable", AliceAvailable);
    sourceEnv.register_CCBLEmitterValue("securityMode", securityMode);
    it("loading rootProgAvatar", () => {
        rootProgAvatarCCBL.loadHumanReadableProgram(rootProgAvatar, sourceEnv, {});
        expect(progEquivalent(rootProgAvatar, rootProgAvatarCCBL.toHumanReadableProgram(), false)).toBe(true);
    });
    it("initiale value of channels are OK in rootProgAvatarCCBL", () => {
        rootProgAvatarCCBL.activate();
        commitStateActions();
        expect(rootProgAvatarCCBL.getValue("lampAvatar")).toEqual("off");
        expect(rootProgAvatarCCBL.getValue("MusicMode")).toEqual("off");
    });
    it("initiale value of channels are OK when red directly from channels", () => {
        expect(lampAvatar.valueEmitter.get()).toEqual("off");
    });
});
//# sourceMappingURL=rootProgAvatar.spec.js.map