import { CCBLContextState } from "./ContextState";
import { CCBLTestClock } from "./Clock";
import { CCBLEvent } from "./Event";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { CCBLEmitterValue } from "./EmitterValue";
let clock = new CCBLTestClock();
let env = new CCBLEnvironmentExecution(clock);
describe("CCBLContextState<boolean, ?, ?> creation:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "false", stateName: "pipo" })
    });
    it("Context is not activable", () => expect(context.getActivable()).toBe(false));
    it("Context is not activated", () => expect(context.getActive()).toBe(false));
    it("State activation has no effect on context", () => {
        context.state.setExpression("true");
        expect(context.getActive()).toBe(false);
    });
});
describe("CCBLContextState<boolean, ?, ?> start and stop:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "false", stateName: "pipo" })
    });
    it("State activation has no effect on context", () => {
        context.state.setExpression("true");
        expect(context.getActive()).toBe(false);
    });
    it("Context activation", () => {
        context.setActivable(true);
        expect(context.getActivable()).toBe(true);
    });
    it("context is active since state was already true", () => {
        expect(context.getActive()).toBe(true);
    });
    it("state becomes inactive", () => {
        context.state.setExpression("false");
        expect(context.getActive()).toBe(false);
    });
    it("state bescomes active", () => {
        context.state.setExpression("true");
        expect(context.getActivable()).toBe(true);
    });
});
describe("CCBLContextState<number, ?, ?> creation:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    const pipoNum = new CCBLEmitterValue(10);
    env.register_CCBLEmitterValue("pipoNum", pipoNum);
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "pipoNum > 20", stateName: "pipo" })
    });
    it("Context is not activable", () => expect(context.getActivable()).toBe(false));
    it("Context is not activated", () => expect(context.getActive()).toBe(false));
    it("State activation has no effect on context", () => {
        pipoNum.set(30);
        expect(context.getActive()).toBe(false);
    });
});
describe("CCBLContextState<number, ?, ?> start and stop:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    const pipoNum = new CCBLEmitterValue(10);
    env.register_CCBLEmitterValue("pipoNum", pipoNum);
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "pipoNum > 20", stateName: "pipo" })
    });
    it("State activation has no effect on context", () => {
        pipoNum.set(30);
        expect(context.getActive()).toBe(false);
    });
    it("Context activation", () => {
        context.setActivable(true);
        expect(context.getActivable()).toBe(true);
    });
    it("context is active since state was already true", () => {
        expect(context.getActive()).toBe(true);
    });
    it("state becomes inactive (at 5)", () => {
        pipoNum.set(5);
        expect(context.getActive()).toBe(false);
    });
    it("state bescomes active (at 25)", () => {
        pipoNum.set(25);
        expect(context.getActive()).toBe(true);
    });
});
describe("CCBLContextState<number, ?, ?> activate only when necessary:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    const pipoNum = new CCBLEmitterValue(10);
    env.register_CCBLEmitterValue("pipoNum", pipoNum);
    let nbStart = 0, nbFinish = 0, nbUpdate = 0, updateActiveChange = 0;
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "pipoNum > 20", stateName: "pipo" })
    });
    context.state.startEvent.on(stateValue => nbStart++);
    context.state.stopEvent.on(stateValue => nbFinish++);
    context.state.onChange(stateValue => nbUpdate++);
    context.onActiveUpdated(activated => updateActiveChange++);
    it("state bescomes active (at 25) -> setActivable", () => {
        expect(nbStart).toBe(0);
        expect(nbUpdate).toBe(0);
        context.setActivable(true);
        expect(nbStart).toBe(0);
        expect(nbFinish).toBe(0);
        expect(nbUpdate).toBe(0);
    });
    it("state bescomes active (at 25) -> context active", () => {
        pipoNum.set(25);
        expect(context.getActive()).toBe(true);
        expect(nbStart).toBe(1);
        expect(nbFinish).toBe(0);
        expect(nbUpdate).toBe(1);
        expect(updateActiveChange).toBe(1);
    });
    it("state stays active (at 30)", () => {
        pipoNum.set(30);
        expect(context.getActive() && nbStart === 1 && nbFinish === 0 && nbUpdate === 1 && updateActiveChange === 1).toBe(true);
    });
    it("state stays active (at 21)", () => {
        pipoNum.set(21);
        expect(context.getActive() && nbStart === 1 && nbFinish === 0 && nbUpdate === 1 && updateActiveChange === 1).toBe(true);
    });
    it("state becomes inactive (at 18)", () => {
        pipoNum.set(18);
        expect(context.getActive() === false && nbStart === 1 && nbFinish === 1 && nbUpdate === 2 && updateActiveChange === 2).toBe(true);
    });
    it("state stays inactive (at 19)", () => {
        pipoNum.set(19);
        expect(context.getActive() === false && nbStart === 1 && nbFinish === 1 && nbUpdate === 2 && updateActiveChange === 2).toBe(true);
    });
    it("state becomes active (at 22)", () => {
        pipoNum.set(22);
        expect(context.getActive() && nbStart === 2 && nbFinish === 1 && nbUpdate === 3 && updateActiveChange === 3).toBe(true);
    });
    it("state becomes inactive (at 12)", () => {
        pipoNum.set(12);
        expect(context.getActive() === false && nbStart === 2 && nbFinish === 2 && nbUpdate === 4 && updateActiveChange === 4).toBe(true);
    });
});
describe("CCBLContextState<?, boolean, boolean> creation:", () => {
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        eventStart: new CCBLEvent({ eventName: "start", env }),
        eventFinish: new CCBLEvent({ eventName: "finish", env })
    });
    it("Context is not activable", () => expect(context.getActivable()).toBe(false));
    it("Context is not activated", () => expect(context.getActive()).toBe(false));
    it("Start-Event activation has no effect on context", () => {
        context.eventStart.trigger({ value: true });
        expect(context.getActive()).toBe(false);
    });
});
describe("CCBLContextState<?, boolean, boolean> activate only when necessary:", () => {
    let nbUpdate = 0;
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        eventStart: new CCBLEvent({ eventName: "start", env }),
        eventFinish: new CCBLEvent({ eventName: "finish", env })
    });
    context.onActiveUpdated(activeValue => nbUpdate++);
    context.setActivable(true);
    it("eventStart(true) => context active", () => {
        context.eventStart.trigger({ value: true });
        clock.forward();
        expect(context.getActive() && nbUpdate === 1).toBe(true);
    });
    it("eventStart(false) => context stays active", () => {
        context.eventStart.trigger({ value: false });
        clock.forward();
        expect(context.getActive() && nbUpdate === 1).toBe(true);
    });
    it("eventFinish(false) => context becomes inactive", () => {
        context.eventFinish.trigger({ value: false });
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 2).toBe(true);
    });
    it("eventStart(true) => context active", () => {
        context.eventStart.trigger({ value: false });
        clock.forward();
        expect(context.getActive() && nbUpdate === 3).toBe(true);
    });
    it("eventStart(false) => context stays active", () => {
        context.eventStart.trigger({ value: true });
        clock.forward();
        expect(context.getActive() && nbUpdate === 3).toBe(true);
    });
    it("eventFinish(false) => context becomes inactive", () => {
        context.eventFinish.trigger({ value: true });
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 4).toBe(true);
    });
});
describe("CCBLContextState<?, evt, evt>:", () => {
    let evt = new CCBLEvent({ eventName: "start", env });
    let context = new CCBLContextState({
        contextName: "pipo",
        environment: env,
        eventStart: evt,
        eventFinish: evt
    });
    context.setActivable(true);
    it("One event should not trigger both begin and end of a context", () => {
        evt.trigger({ value: true });
        expect(context.getActive()).toBe(true);
    });
});
describe("CCBLContextState<?, evtS, evtF>:", () => {
    let evtS = new CCBLEvent({ eventName: "start", env });
    let evtF = new CCBLEvent({ eventName: "finish", env });
    let context = new CCBLContextState({
        contextName: "pipo",
        environment: env,
        eventStart: evtS,
        eventFinish: evtF
    });
    context.setActivable(true);
    it("If evtE and evtF trigger at the same time, the context should remains active", () => {
        evtS.trigger({ value: true, ms: 100 });
        evtF.trigger({ value: true, ms: 100 });
        expect(context.getActive()).toBe(true);
    });
});
describe("CCBLContextState<?, number, number> creation:", () => {
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        eventStart: new CCBLEvent({ eventName: "start", env }),
        eventFinish: new CCBLEvent({ eventName: "finish", env })
    });
    it("Context is not activable", () => expect(context.getActivable()).toBe(false));
    it("Context is not activated", () => expect(context.getActive()).toBe(false));
    it("Start-Event activation has no effect on context", () => {
        context.eventStart.trigger({ value: 17 });
        return expect(context.getActive()).toBe(false);
    });
});
describe("CCBLContextState<?, number, number> (Hysteresis 18-20):", () => {
    let nbUpdate = 0;
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        eventStart: new CCBLEvent({ eventName: "start", env, expressionFilter: "event.value < 18" }),
        eventFinish: new CCBLEvent({ eventName: "finish", env, expressionFilter: "event.value > 20" })
    });
    context.onActiveUpdated(activeValue => nbUpdate++);
    context.setActivable(true);
    it("T°===18 => context stays inactive", () => {
        context.eventStart.trigger({ value: 18 });
        context.eventFinish.trigger({ value: 18 });
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 0).toBe(true);
    });
    it("T°===17 => context becomes active", () => {
        context.eventStart.trigger({ value: 17 });
        context.eventFinish.trigger({ value: 17 });
        clock.forward();
        expect(context.getActive() === true && nbUpdate === 1).toBe(true);
    });
    it("T°===19 => context stays active", () => {
        context.eventStart.trigger({ value: 19 });
        context.eventFinish.trigger({ value: 19 });
        clock.forward();
        expect(context.getActive() === true && nbUpdate === 1).toBe(true);
    });
    it("T°===21 => context becomes inactive", () => {
        context.eventStart.trigger({ value: 21 });
        context.eventFinish.trigger({ value: 21 });
        clock.forward();
        return expect(context.getActive() === false && nbUpdate === 2).toBe(true);
    });
    it("T°===18.5 => context stays inactive", () => {
        context.eventStart.trigger({ value: 18.5 });
        context.eventFinish.trigger({ value: 18.5 });
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 2).toBe(true);
    });
    it("T°===17 => context becomes active", () => {
        context.eventStart.trigger({ value: 17 });
        context.eventFinish.trigger({ value: 17 });
        clock.forward();
        expect(context.getActive() === true && nbUpdate === 3).toBe(true);
    });
});
describe("CCBLContextState<number, number, number> unactivated:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    const pipoNum = new CCBLEmitterValue(10);
    env.register_CCBLEmitterValue("pipoNum", pipoNum);
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "pipoNum > 20 & pipoNum < 30", stateName: "pipo" }),
        eventStart: new CCBLEvent({ eventName: "start", env, expressionFilter: "event.value > 0" }),
        eventFinish: new CCBLEvent({ eventName: "finish", env, expressionFilter: "event.value == 27" })
    });
    it("Context is not activable", () => expect(context.getActivable()).toBe(false));
    it("Context is not activated", () => expect(context.getActive()).toBe(false));
    it("Start-Event activation has no effect on context", () => {
        context.eventStart.trigger({ value: 17 });
        expect(context.getActive()).toBe(false);
    });
    it("State activation has no effect on context", () => {
        pipoNum.set(25);
        expect(context.getActive()).toBe(false);
    });
});
describe("CCBLContextState<number, number, number> activated:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    const pipoNum = new CCBLEmitterValue(10);
    env.register_CCBLEmitterValue("pipoNum", pipoNum);
    let nbUpdate = 0;
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "pipoNum > 20 & pipoNum < 30", stateName: "pipo" }),
        eventStart: new CCBLEvent({ eventName: "start", env, expressionFilter: "event.value >   0" }),
        eventFinish: new CCBLEvent({ eventName: "finish", env, expressionFilter: "event.value == 27" })
    });
    context.setActivable(true);
    context.onActiveUpdated(activeValue => nbUpdate++);
    it("State activation has no effect on context", () => {
        pipoNum.set(25);
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 0).toBe(true);
    });
    it("eventStart do not activate context if state is not activated (state 17)", () => {
        pipoNum.set(17);
        context.eventStart.trigger({ value: 17 });
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 0).toBe(true);
    });
    it("State activation has no effect on context", () => {
        pipoNum.set(25);
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 0).toBe(true);
    });
    it("eventStart activate context if state is activated: Context becomes activated", () => {
        context.eventStart.trigger({ value: 17 });
        clock.forward();
        expect(context.getActive()).toBe(true);
    });
    it("eventStart activate context if state is activated: nbUpdate===1", () => {
        expect(nbUpdate).toBe(1);
    });
    it("eventFinish 17 does not unactivate context", () => {
        context.eventFinish.trigger({ value: 17 });
        clock.forward();
        expect(context.getActive() === true && nbUpdate === 1).toBe(true);
    });
    it("eventFinish 27 does unactivate context", () => {
        context.eventFinish.trigger({ value: 27 });
        clock.forward();
        expect(context.getActive() === false && nbUpdate === 2).toBe(true);
    });
});
describe("CCBLContextState<number, number, number> activated:", () => {
    const env = new CCBLEnvironmentExecution(clock);
    const pipoNum = new CCBLEmitterValue(10);
    env.register_CCBLEmitterValue("pipoNum", pipoNum);
    let nbUpdate = 0;
    let context = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({ env, expression: "pipoNum > 20 & pipoNum < 30", stateName: "pipo" }),
        eventStart: new CCBLEvent({ eventName: "start", env, expressionFilter: "event.value >   0" }),
        eventFinish: new CCBLEvent({ eventName: "finish", env, expressionFilter: "event.value == 27" })
    });
    context.setActivable(true);
    context.onActiveUpdated(activeValue => nbUpdate++);
    it("eventStart activate context if state is activated", () => {
        pipoNum.set(25);
        context.eventStart.trigger({ value: 17 });
        expect(context.getActive() && nbUpdate === 1).toBe(true);
    });
    it("state change to 17 does unactivate context", () => {
        pipoNum.set(17);
        expect(context.getActive() === false && nbUpdate === 2).toBe(true);
    });
});
//# sourceMappingURL=Context.spec.js.map