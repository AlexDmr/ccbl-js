import { CCBLTestClock } from "../Clock";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { commitStateActions, getNewChannel } from "../Channel";
import { CCBLEvent } from "../Event";
import { domicube } from "./domicube";
describe("Domicube", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const gyro = new CCBLEmitterValue({ alpha: 0, beta: 0, gamma: 0 });
    const acc = new CCBLEmitterValue({ x: 0, y: 100, z: 0 });
    const lampAvatar = getNewChannel(undefined);
    const btToggleAvatarOnOff = new CCBLEvent({
        eventName: "btToggleAvatarOnOff",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.register_CCBLEmitterValue("gyro", gyro);
    sourceEnv.register_CCBLEmitterValue("acc", acc);
    sourceEnv.register_Channel("lampAvatar", lampAvatar);
    sourceEnv.registerCCBLEvent("btToggleAvatarOnOff", btToggleAvatarOnOff);
    it("should have the correct initial values", () => {
        rootProg.loadHumanReadableProgram(domicube, sourceEnv, {});
        acc.set({ x: 10, y: 20, z: 20 });
        gyro.set({ alpha: 0, beta: 0, gamma: 0 });
        rootProg.activate();
        commitStateActions();
        let tmp;
        expect(tmp = rootProg.getValue("R")).toEqual(0);
        expect(tmp = rootProg.getValue("accNorm")).toEqual(30);
        expect(tmp = rootProg.getValue("rotation")).toEqual("none");
        expect(tmp = rootProg.getValue("face")).toEqual(`unknown`);
    });
    it("acc={x: 9.81, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=1000 => Init 'timer'", () => {
        acc.set({ x: 9.81, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(1000);
        commitStateActions();
        expect(rootProg.getValue("movingFast")).toEqual(false);
        expect(rootProg.getValue("G")).toEqual(9.81);
        expect(rootProg.getValue("accNorm")).toEqual(9.81);
        expect(rootProg.getValue("R")).toEqual(1);
        expect(rootProg.getValue("rotation")).toEqual("clockwise");
        expect(rootProg.getValue("face")).toEqual(1);
    });
    it("acc={x: 0, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=2000 => R=0, face unknown", () => {
        acc.set({ x: 0, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(2000);
        commitStateActions();
        expect(rootProg.getValue("movingFast")).toEqual(true);
        expect(rootProg.getValue("accNorm")).toEqual(0);
        expect(rootProg.getValue("R")).toEqual(0);
        expect(rootProg.getValue("rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual(`unknown`);
    });
});
//# sourceMappingURL=domicube.spec.js.map