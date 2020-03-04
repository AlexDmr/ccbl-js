"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const EmitterValue_1 = require("../EmitterValue");
const Channel_1 = require("../Channel");
const rootProgAvatar_1 = require("./rootProgAvatar");
describe("rootProgAvatar", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProgAvatarCCBL = new ProgramObject_1.CCBLProgramObject("rootProgAvatar", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const lampAvatar = Channel_1.getNewChannel("");
    const BobAtHome = new EmitterValue_1.CCBLEmitterValue(false);
    const AliceAtHome = new EmitterValue_1.CCBLEmitterValue(false);
    const AliceAtBobHome = new EmitterValue_1.CCBLEmitterValue(false);
    const AliceAvailable = new EmitterValue_1.CCBLEmitterValue(false);
    const securityMode = new EmitterValue_1.CCBLEmitterValue(false);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.register_CCBLEmitterValue("BobAtHome", BobAtHome);
    sourceEnv.register_CCBLEmitterValue("AliceAtHome", AliceAtHome);
    sourceEnv.register_CCBLEmitterValue("AliceAtBobHome", AliceAtBobHome);
    sourceEnv.register_CCBLEmitterValue("AliceAvailable", AliceAvailable);
    sourceEnv.register_CCBLEmitterValue("securityMode", securityMode);
    it("loading rootProgAvatar", () => {
        rootProgAvatarCCBL.loadHumanReadableProgram(rootProgAvatar_1.rootProgAvatar, sourceEnv, {});
        expect(ProgramObjectInterface_1.progEquivalent(rootProgAvatar_1.rootProgAvatar, rootProgAvatarCCBL.toHumanReadableProgram())).toBe(true);
    });
    it("initiale value of channels are OK in rootProgAvatarCCBL", () => {
        rootProgAvatarCCBL.activate();
        Channel_1.commitStateActions();
        expect(rootProgAvatarCCBL.getValue("lampAvatar")).toEqual("off");
        expect(rootProgAvatarCCBL.getValue("MusicMode")).toEqual("off");
    });
    it("initiale value of channels are OK when red directly from channels", () => {
        expect(lampAvatar.valueEmitter.get()).toEqual("off");
    });
});
//# sourceMappingURL=rootProgAvatar.spec.js.map