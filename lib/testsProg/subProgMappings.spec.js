import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram, progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { getNewChannel } from "../Channel";
import { CCBLEmitterValue } from "../EmitterValue";
import { CCBLEvent } from "../Event";
import { parentProg } from "./subProgMappings";
describe("subProgMappings::Load and compare", () => {
    const clock = new CCBLTestClock();
    const prog = new CCBLProgramObject("subProgMappings", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const C1 = getNewChannel(0);
    const C2 = getNewChannel(0);
    const A = new CCBLEmitterValue(0);
    const B = new CCBLEmitterValue(0);
    const evt1 = new CCBLEvent({ eventName: "evt1", env: sourceEnv, expressionFilter: "" });
    sourceEnv.register_Channel("C1", C1);
    sourceEnv.register_Channel("C2", C2);
    sourceEnv.register_CCBLEmitterValue("A", A);
    sourceEnv.register_CCBLEmitterValue("B", B);
    sourceEnv.registerCCBLEvent("evt1", evt1);
    it("prog and its copy should be equivalent", () => {
        const cpProg = copyHumanReadableProgram(parentProg);
        expect(progEquivalent(parentProg, cpProg)).toEqual(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        prog.loadHumanReadableProgram(parentProg, sourceEnv, {});
        const seri = prog.toHumanReadableProgram();
        expect(progEquivalent(parentProg, seri, false)).toBe(true);
    });
    it("Loading should be OK and toHumanReadableProgram should be equivalent", () => {
        clock.goto(0);
        prog.activate();
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.val")).toEqual(0);
    });
    it("@t1000, oscillo1.val should equal 0", () => {
        clock.goto(1000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.val")).toEqual(0);
        expect(prog.getValue("oscillo1.log")).toEqual("root");
    });
    it("@t2000, bt triggered, oscillo1.val should equal 0", () => {
        clock.goto(2000);
        evt1.trigger({ value: 0 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.val")).toEqual(0);
        expect(prog.getValue("oscillo1.log")).toEqual("Up");
    });
    it("@t2500, oscillo1.val should equal 50", () => {
        clock.goto(2500);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Up");
        expect(prog.getValue("oscillo1.val")).toEqual(50);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3000, oscillo1.val should equal 50", () => {
        clock.goto(3000);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Down");
        expect(prog.getValue("oscillo1.val")).toEqual(100);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3500, oscillo1.val should equal 50", () => {
        clock.goto(3500);
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Down");
        expect(prog.getValue("oscillo1.val")).toEqual(50);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3600, bt triggered but value < 0 => Nothing new", () => {
        clock.goto(3600);
        evt1.trigger({ value: -2 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("Down");
        expect(prog.getValue("oscillo1.val")).toEqual(40);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t3700, bt triggered => exit oscillations", () => {
        clock.goto(3700);
        evt1.trigger({ value: 2 });
        prog.UpdateChannelsActions();
        expect(prog.getValue("oscillo1.log")).toEqual("root");
        expect(prog.getValue("oscillo1.val")).toEqual(0);
        expect(prog.getValue("C1") === prog.getValue("oscillo1.val")).toEqual(true);
    });
    it("@t10000 : Disposing program should be OK", () => {
        clock.goto(3700);
        prog.UpdateChannelsActions();
        let ok;
        try {
            prog.dispose();
            ok = true;
        }
        catch (err) {
            ok = false;
            console.error("prog.dispose error:\n", err);
        }
        expect(ok).toEqual(true);
    });
});
//# sourceMappingURL=subProgMappings.spec.js.map