import { CCBLTestClock } from "../Clock";
import { copyHumanReadableProgram } from "../ProgramObjectInterface";
import { CCBLProgramObject } from "../ProgramObject";
import { CCBLEnvironmentExecution } from "../ExecutionEnvironment";
import { CCBLEvent } from "../Event";
import { ContextStateEventsStartFinish } from "./ContextStateEventsStartFinish";
import { CCBLEmitterValue } from "../EmitterValue";
import { Channel } from "../Channel";
describe("ContextStateEventsStartFinish:: ", () => {
    const P = copyHumanReadableProgram(ContextStateEventsStartFinish);
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const bt = new CCBLEvent({
        eventName: "bt",
        expressionFilter: "",
        env: sourceEnv
    });
    const temp = new CCBLEmitterValue(0);
    const ambiance = new Channel(new CCBLEmitterValue(''));
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