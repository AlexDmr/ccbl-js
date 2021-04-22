import { CCBLTestClock } from "../Clock";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { getNewChannel } from "../Channel";
import { CCBLEvent } from "../Event";
import { progPbClock } from "./progPbClock";
describe("progPbClock", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("progPbClock", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => rootProg.UpdateChannelsActions(), true);
    const R = getNewChannel(undefined);
    const lamp = getNewChannel(undefined);
    const ambiance = getNewChannel(undefined);
    const presenceAlice = new CCBLEmitterValue(false);
    const presenceBob = new CCBLEmitterValue(false);
    const bt1 = new CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    const bt2 = new CCBLEvent({
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
        rootProg.loadHumanReadableProgram(progPbClock, sourceEnv, {});
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
    it("presenceBob => nextForeseenUpdate = 11000", () => {
        presenceBob.set(true);
        expect(clock.nextForeseenUpdate).toEqual(11000);
        expect(clock.getTimesForUpdate().length).toEqual(1);
    });
    it("@11500", () => {
        clock.goto(10500);
        expect(clock.nextForeseenUpdate).toEqual(11000);
        expect(clock.getTimesForUpdate().length).toEqual(1);
    });
    it("@10600: presenceAlice", () => {
        clock.goto(10600);
        presenceAlice.set(true);
        expect(clock.nextForeseenUpdate).toEqual(11000);
        expect(clock.getTimesForUpdate().length).toEqual(1);
    });
    it("@10700: bt1", () => {
        clock.goto(10700);
        bt1.trigger({ value: true });
        expect(clock.nextForeseenUpdate).toEqual(11000);
        const L = clock.getTimesForUpdate();
        expect(L.length).toEqual(3);
        expect(L[0]).toEqual(11000);
        expect(L[1]).toEqual(11700);
        expect(L[2]).toEqual(11700);
    });
    it("@11500: bt1", () => {
        clock.goto(11500);
        expect(clock.nextForeseenUpdate).toEqual(11700);
        const L = clock.getTimesForUpdate();
        expect(L.length).toEqual(3);
        expect(L[0]).toEqual(11700);
        expect(L[1]).toEqual(11700);
        expect(L[2]).toEqual(12000);
    });
});
//# sourceMappingURL=progPbClock.spec.js.map