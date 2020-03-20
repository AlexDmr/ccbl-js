"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObjectInterface_1 = require("../ProgramObjectInterface");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
const Event_1 = require("../Event");
const ContextStateEventsStartFinish_1 = require("./ContextStateEventsStartFinish");
const EmitterValue_1 = require("../EmitterValue");
const Channel_1 = require("../Channel");
describe("ContextStateEventsStartFinish:: ", () => {
    const P = ProgramObjectInterface_1.copyHumanReadableProgram(ContextStateEventsStartFinish_1.ContextStateEventsStartFinish);
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const bt = new Event_1.CCBLEvent({
        eventName: "bt",
        expressionFilter: "",
        env: sourceEnv
    });
    const temp = new EmitterValue_1.CCBLEmitterValue(0);
    const ambiance = new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(''));
    sourceEnv.registerCCBLEvent("bt", bt);
    sourceEnv.register_CCBLEmitterValue("temp", temp);
    sourceEnv.register_Channel("ambiance", ambiance);
    it('t0, should have correct initial values', () => {
        rootProg.loadHumanReadableProgram(P, sourceEnv, {});
        rootProg.activate();
        clock.goto(0);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('black');
    });
    it('t10, when bt pressed, should not enter during context', () => {
        clock.goto(10);
        bt.trigger({ value: false });
        expect(rootProg.getValue('ambiance')).toEqual('black');
    });
    it('t20, temp becomes 22 should not enter the during context', () => {
        clock.goto(20);
        temp.set(22);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('black');
    });
    it('t30, when bt pressed, should enter during context => ambiance yellow', () => {
        clock.goto(30);
        bt.trigger({ value: false });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('yellow');
    });
    it('t40, temp becomes 21 should remains in the during context', () => {
        clock.goto(40);
        temp.set(21);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('yellow');
    });
    it('t50, temp becomes 19 should exit the during context => ambiance black', () => {
        clock.goto(50);
        temp.set(19);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('black');
    });
    it('t60, temp becomes 22 should not enter the during context', () => {
        clock.goto(60);
        temp.set(22);
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('black');
    });
    it('t70, when bt pressed, should enter during context => ambiance yellow', () => {
        clock.goto(70);
        bt.trigger({ value: false });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('yellow');
    });
    it('t80, when bt pressed, should exit during context => ambiance black', () => {
        clock.goto(80);
        bt.trigger({ value: false, ms: 80 });
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue('ambiance')).toEqual('black');
    });
});
//# sourceMappingURL=ContextStateEventsStartFinish.spec.js.map