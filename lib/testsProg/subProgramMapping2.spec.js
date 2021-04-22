import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram, progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { getNewChannel } from "../Channel";
import { CCBLEmitterValue } from "../EmitterValue";
import { CCBLEvent } from "../Event";
import { subProgMapping2 } from "./subProgramMapping2";
describe("subProgMappings::Load and compare", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("subProgMapping2", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const R = getNewChannel(0);
    const G = getNewChannel(0);
    const B = getNewChannel(0);
    const lamp = getNewChannel('');
    const temp = new CCBLEmitterValue(0);
    const presenceAlice = new CCBLEmitterValue(false);
    const presenceBob = new CCBLEmitterValue(false);
    const bt1 = new CCBLEvent({ eventName: "bt1", env: sourceEnv, expressionFilter: "" });
    const bt2 = new CCBLEvent({ eventName: "bt2", env: sourceEnv, expressionFilter: "" });
    sourceEnv.register_Channel("R", R);
    sourceEnv.register_Channel("G", G);
    sourceEnv.register_Channel("B", B);
    sourceEnv.register_Channel("lamp", lamp);
    sourceEnv.register_CCBLEmitterValue("temp", temp);
    sourceEnv.register_CCBLEmitterValue("presenceAlice", presenceAlice);
    sourceEnv.register_CCBLEmitterValue("presenceBob", presenceBob);
    sourceEnv.registerCCBLEvent("bt1", bt1);
    sourceEnv.registerCCBLEvent("bt2", bt2);
    it("prog and its copy should be equivalent", () => {
        const cpProg = copyHumanReadableProgram(subProgMapping2);
        expect(progEquivalent(subProgMapping2, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(subProgMapping2, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(progEquivalent(subProgMapping2, seri, false)).toBe(true);
    });
    it("Clock nextForeseenUpdate should be undefined", () => {
        expect(clock.nextForeseenUpdate).toBe(undefined);
    });
    it("Loading should be OK and channels value", () => {
        clock.goto(0);
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(0);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
    it("@t1000, oscillo1.val should equal 0", () => {
        clock.goto(1000);
        presenceAlice.set(true);
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(0);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
    it("@t1500, oscillo1.val should equal 0", () => {
        clock.goto(1500);
        bt1.trigger({ value: false });
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(0);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
    it("@t2000, oscillo1.val should equal 0", () => {
        clock.goto(2000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("R")).toEqual(127.5);
        expect(prog.getValue("G")).toEqual(0);
        expect(prog.getValue("B")).toEqual(0);
        expect(prog.getValue("lamp")).toEqual("black");
    });
});
//# sourceMappingURL=subProgramMapping2.spec.js.map