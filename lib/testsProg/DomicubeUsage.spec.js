import { CCBLTestClock } from "../Clock";
import { getAllContextOrProgramsFromProg, progEquivalent } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEmitterValue } from "../EmitterValue";
import { commitStateActions, getNewChannel } from "../Channel";
import { CCBLEvent } from "../Event";
import { domicubePlus } from "./DomicubeUsage";
describe("The Domicube Plus", () => {
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    clock.onChange(() => commitStateActions(), true);
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
    const resetVolume = new CCBLEvent({
        eventName: "resetVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("resetVolume", resetVolume);
    const muteVolume = new CCBLEvent({
        eventName: "muteVolume",
        expressionFilter: "",
        env: sourceEnv
    });
    sourceEnv.registerCCBLEvent("muteVolume", muteVolume);
    it("should have the correct initial values", () => {
        rootProg.loadHumanReadableProgram(domicubePlus, sourceEnv, {});
        acc.set({ x: 10, y: 10, z: 10 });
        gyro.set({ alpha: 0, beta: 0, gamma: 0 });
        rootProg.activate();
        commitStateActions();
        expect(rootProg.getValue("Volume")).toEqual(0);
        expect(rootProg.getValue("rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual(`unknown`);
    });
    it("should be able to reload the very same program", () => {
        const P1 = rootProg.toHumanReadableProgram();
        rootProg.loadHumanReadableProgram(domicubePlus, sourceEnv, {});
        const P2 = rootProg.toHumanReadableProgram();
        expect(progEquivalent(P1, P2, false)).toEqual(true);
    });
    it("toHumanReadable has ids for contexts and actions", () => {
        const P = rootProg.toHumanReadableProgram();
        const L = getAllContextOrProgramsFromProg(P);
        expect(L.length).withContext("There should be 13 contexts and 1 prog instance").toEqual(14);
        for (const C of L) {
            let LAS = [];
            let LAE = [];
            let msg = "unknown element";
            const sc = C;
            if (sc.contextName !== undefined) {
                msg = `Context ${sc.contextName} should have an id`;
                if (sc.type === "EVENT") {
                    LAE.push(...sc.actions);
                }
                else {
                    LAS.push(...(sc.actions ?? []));
                    LAE.push(...(sc.actionsOnStart ?? []), ...(sc.actionsOnEnd ?? []));
                }
            }
            else {
                const pi = C;
                if (pi.programId !== undefined) {
                    msg = `Program reference ${pi.as} should have an id`;
                }
            }
            expect(C.id).withContext(msg).toBeDefined();
            for (const A of LAS) {
                expect(A.id).withContext(`state action on ${A.channel} should be defined`).toBeDefined();
            }
            for (const A of LAE) {
                let msg = "unknown event action";
                const chanA = A;
                if (chanA.channel !== undefined) {
                    msg = `event channel action on ${chanA.channel} should have an id`;
                }
                else {
                    const evtTrig = A;
                    msg = `event trigger action on ${evtTrig.eventer} should have an id`;
                }
                expect(A.id).withContext(msg).toBeDefined();
            }
        }
    });
    it("should export a correct description of contexts, actions and subprograms", () => {
        const elements = rootProg.getCcblElements();
        expect(elements.program).toBe(rootProg);
        expect(Object.values(elements.stateContexts).length).toEqual(12);
        expect(rootProg.getRootContext().getChannelActionStates().length).toEqual(8);
        expect(Object.values(elements.stateActions).length).toEqual(19);
        expect(Object.values(elements.eventContexts).length).toEqual(2);
        expect(Object.values(elements.eventActions).length).toEqual(10);
        expect(elements.subProgramInstances["DomicubeBase"]).toBeDefined();
        const DomicubeBase = elements.subProgramInstances["DomicubeBase"];
        if (DomicubeBase) {
            expect(Object.values(DomicubeBase.stateContexts).length).toEqual(11);
            expect(Object.values(DomicubeBase.stateActions).length).toEqual(24);
            expect(Object.values(DomicubeBase.eventContexts).length).toEqual(0);
            expect(Object.values(DomicubeBase.eventContexts).length).toEqual(0);
        }
    });
    it("acc={x: 9.81, y:0, z:0} && gyro={alpha: 1, beta: 0, gamma: 0}, clock=1000 => Init 'timer'", () => {
        acc.set({ x: 9.81, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(1000);
        let tmp;
        expect(tmp = rootProg.getValue('DomicubeBase.isOn')).toEqual(true);
        expect(tmp = rootProg.getValue("Volume")).toEqual(0);
        expect(tmp = rootProg.getValue("rotation")).toEqual("clockwise");
        expect(tmp = rootProg.getValue("face")).toEqual(1);
        expect(tmp = rootProg.getValue("log")).toEqual("IncreaseVolume");
        expect(tmp = rootProg.getValue("N")).toEqual(1);
    });
    it("clock=1005 => N=1 and Volume=0", () => {
        acc.set({ x: 9.82, y: 0, z: 0 });
        clock.goto(1005);
        expect(rootProg.getValue("Volume")).toEqual(0);
        expect(rootProg.getValue("N")).toEqual(1);
    });
    it("clock=1010 => Volume=1", () => {
        acc.set({ x: 9.83, y: 0, z: 0 });
        clock.goto(1010);
        expect(rootProg.getValue("Volume")).toEqual(1);
        expect(rootProg.getValue("N")).toEqual(2);
    });
    it("clock=1020 => Volume=2", () => {
        clock.goto(1020);
        expect(rootProg.getValue("Volume")).toEqual(2);
        expect(rootProg.getValue("N")).toEqual(3);
    });
    it("clock=1030 => Volume=3", () => {
        clock.goto(1030);
        expect(rootProg.getValue("Volume")).toEqual(3);
        expect(rootProg.getValue("N")).toEqual(4);
    });
    it("clock=1060 => Volume=6", () => {
        acc.set({ x: 9.833, y: 0, z: 0 });
        acc.set({ x: 9.832, y: 0, z: 0 });
        acc.set({ x: 9.831, y: 0, z: 0 });
        clock.goto(1060);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("N")).toEqual(7);
    });
    it("clock=1065, acc=0, gyro=0 => Volume=6, root level", () => {
        acc.set({ x: 0, y: 0, z: 0 });
        gyro.set({ alpha: 1, beta: 0, gamma: 0 });
        clock.goto(1065);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("log")).toEqual("at root level");
        expect(rootProg.getValue("N")).toEqual(7);
        expect(rootProg.getValue("DomicubeBase.face")).toEqual("unknown");
        expect(rootProg.getValue("DomicubeBase.rotation")).toEqual("none");
        expect(rootProg.getValue("face")).toEqual("unknown");
        expect(rootProg.getValue("rotation")).toEqual("none");
    });
    it("clock=1100, acc=0, gyro=0 => Volume=6, root level", () => {
        clock.goto(1100);
        expect(rootProg.getValue("Volume")).toEqual(6);
        expect(rootProg.getValue("N")).toEqual(7);
        expect(rootProg.getValue("log")).toEqual("at root level");
    });
    it('should reset the volume', () => {
        clock.goto(1200);
        resetVolume.trigger({ value: 'press' });
        commitStateActions();
        expect(rootProg.getValue('Volume')).toEqual(6);
        clock.goto(1220);
        expect(rootProg.getValue('Volume')).toEqual(24.8);
        clock.goto(1260);
        expect(rootProg.getValue('Volume')).toEqual(62.4);
        clock.goto(1300);
        expect(rootProg.getValue('Volume')).toEqual(100);
        clock.goto(1350);
        expect(rootProg.getValue('Volume')).toEqual(100);
    });
    it('should change channel', function () {
        clock.goto(1400);
        expect(rootProg.getValue('Channel')).toEqual(1);
        gyro.set({ alpha: 0, beta: 1, gamma: 0 });
        acc.set({ x: 0, y: 9.81, z: 0 });
        commitStateActions();
        expect(rootProg.getValue('Channel')).toEqual(1);
        expect(rootProg.getValue('log')).toEqual("IncreaseChannel");
        clock.goto(1450);
        expect(rootProg.getValue('Channel')).toEqual(6);
    });
});
//# sourceMappingURL=DomicubeUsage.spec.js.map