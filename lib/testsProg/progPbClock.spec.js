"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const EmitterValue_1 = require("../EmitterValue");
const Channel_1 = require("../Channel");
const Event_1 = require("../Event");
const progPbClock_1 = require("./progPbClock");
describe("progPbClock", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("progPbClock", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    clock.onChange(() => Channel_1.commitStateActions(), true);
    const R = Channel_1.getNewChannel();
    const lamp = Channel_1.getNewChannel();
    const ambiance = Channel_1.getNewChannel();
    const presenceAlice = new EmitterValue_1.CCBLEmitterValue(false);
    const presenceBob = new EmitterValue_1.CCBLEmitterValue(false);
    const bt1 = new Event_1.CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    const bt2 = new Event_1.CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_Channel("R", R);
    sourceEnv.register_Channel("lamp", lamp);
    sourceEnv.register_Channel("ambiance", ambiance);
    sourceEnv.register_CCBLEmitterValue("presenceAlice", presenceAlice);
    sourceEnv.register_CCBLEmitterValue("presenceBob", presenceBob);
    sourceEnv.registerCCBLEvent("bt1", bt1);
    sourceEnv.registerCCBLEvent("bt2", bt2);
    it("clock nextForeseenUpdate should be undefined", () => {
        rootProg.loadHumanReadableProgram(progPbClock_1.progPbClock, sourceEnv, {});
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("clock goto 10000, nextForeseenUpdate should be undefined", () => {
        clock.goto(10000);
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("activate => nextForeseenUpdate should STILL be undefined", () => {
        rootProg.activate(true);
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
});
//# sourceMappingURL=progPbClock.spec.js.map