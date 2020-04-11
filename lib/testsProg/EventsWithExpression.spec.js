"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const EventsWithExpression_1 = require("./EventsWithExpression");
const Clock_1 = require("../Clock");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Event_1 = require("../Event");
const ProgramObject_1 = require("../ProgramObject");
const EmitterValue_1 = require("../EmitterValue");
describe("Simulation for EventsWithExpression", () => {
    const P = ProgramObjectInterface_1.copyHumanReadableProgram(EventsWithExpression_1.eventsWithExpression);
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const EvtPlus = new Event_1.CCBLEvent({
        eventName: "EvtPlus",
        env: sourceEnv
    });
    const EvtMinus = new Event_1.CCBLEvent({
        eventName: "EvtMinus",
        env: sourceEnv
    });
    const A = new EmitterValue_1.CCBLEmitterValue(0);
    A.setIsAvailable(true);
    const B = new EmitterValue_1.CCBLEmitterValue(0);
    B.setIsAvailable(true);
    sourceEnv.registerCCBLEvent("EvtPlus", EvtPlus)
        .registerCCBLEvent("EvtMinus", EvtMinus)
        .register_CCBLEmitterValue("A", A)
        .register_CCBLEmitterValue("B", B);
    let CP;
    it("Loading program eventsWithExpression, human versions original and generated should be equivalent", () => {
        rootProg.loadHumanReadableProgram(P, sourceEnv, {});
        CP = rootProg.toHumanReadableProgram();
        const eq = ProgramObjectInterface_1.progEquivalent(P, CP);
        if (!eq) {
            console.log("EventsWithExpression", P, CP);
        }
        expect(eq).toBe(true);
    });
    it("EndWith should be equivalent", () => {
        const c1 = P.allen.EndWith[0];
        const c2 = CP.allen.EndWith[0];
        expect(ProgramObjectInterface_1.contextEquivalent(c1, c2, false)).toBe(true);
    });
    it("During[0] should be equivalent", () => {
        const c1 = P.allen.During[0];
        const c2 = CP.allen.During[0];
        const eq = ProgramObjectInterface_1.contextEquivalent(c1, c2, false);
        if (!eq) {
            console.log("EventsWithExpression During[0]", c1, c2);
        }
        expect(eq).toBe(true);
    });
    it("During[3] should be equivalent", () => {
        const c1 = P.allen.During[3];
        const c2 = CP.allen.During[3];
        const eq = ProgramObjectInterface_1.contextEquivalent(c1, c2, false);
        if (!eq) {
            console.log("EventsWithExpression During[3]", c1, c2);
        }
        expect(eq).toBe(true);
    });
    it("N should be 10 when starting program because context DEBUT is active", () => {
        rootProg.activate();
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(10);
    });
    it("EvtPlus.trigger(true) should not set N to 11", () => {
        EvtPlus.trigger({ value: true });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(10);
    });
    it("A = -11 and B = 11 should exit context DEBUT and N should be set to 0", () => {
        A.set(-11);
        B.set(11);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(0);
    });
    it("EvtPlus.trigger(true) should set N to 1", () => {
        EvtPlus.trigger({ value: true });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("EvtPlus.trigger(false) should not set N, therefore N should still be 1", () => {
        EvtPlus.trigger({ value: false });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("B = 1 should triggers nothing", () => {
        B.set(1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("A = 1 should triggers context 3 so N should be 50", () => {
        A.set(1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(50);
    });
    it("B = -1 should exit context 3 so N should be 1 again", () => {
        B.set(-1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("B = 99 should not enters context 3 because A has not changed", () => {
        B.set(99);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("A = 1 so A do not change so not enters context 3", () => {
        A.set(1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("A = 2 should not enters context 3 because A > 0 remains true so N = 1", () => {
        A.set(2);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("A = -1 should not enters context 3 because A > 0 becomes false so N = 1", () => {
        A.set(-1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("A = 2 should enters context 3 because A > 0 becomes true so N = 1", () => {
        A.set(2);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(50);
    });
    it("EvtPlus should do nothing as context 3 is active", () => {
        EvtPlus.trigger({ value: true });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(50);
    });
    it("A = -100 should exits context 3 because A + B < 0 so N = 1", () => {
        A.set(-100);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(1);
    });
    it("A = 1 should enters context 3 so N = 50", () => {
        A.set(1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(50);
    });
    it("A = 200 should enters context FIN so N = 100", () => {
        A.set(200);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(100);
    });
    it("EvtMinus should do nothing as context FIN is active", () => {
        EvtMinus.trigger({ value: true });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(100);
    });
    it("rootProg.activate(false), N should remains 100", () => {
        rootProg.activate(false);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(100);
    });
    it("EvtMinus should do nothing as rootProg is not activated", () => {
        EvtMinus.trigger({ value: true });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(100);
    });
    it("A = -1 and B = 1 and rootProg.activate(true), N should becomes 10", () => {
        A.set(-1);
        B.set(1);
        rootProg.activate(true);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(10);
    });
    it("A = 6 and B = 6, exists DEBUT, enter During, N should becomes 50", () => {
        A.set(6);
        B.set(6);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(50);
    });
    it("A = -6, exists During, N should becomes 0", () => {
        A.set(-6);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(0);
    });
    it("EvtMinus should set N to -1", () => {
        EvtMinus.trigger({ value: true });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(-1);
    });
    it("A = 1 and B = -1, N should remains -1", () => {
        A.set(1);
        B.set(-1);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('N')).toEqual(-1);
    });
    it("A = 300 should enters context FIN because A > 100 becomes true so N = 100", () => {
        A.set(300);
        rootProg.UpdateChannelsActions();
        console.log(P);
        expect(rootProg.getValue('N')).toEqual(100);
    });
});
//# sourceMappingURL=EventsWithExpression.spec.js.map