import { CCBLTestClock } from "./Clock";
import { ChannelActionState } from "./ChannelActionState";
import { commitStateActions, createChannel, getNewChannel, registerChannel } from "./Channel";
import { CCBLContextState } from "./ContextState";
import { CCBLAllenDuring } from "./AllenDuring";
import { StructuralOrder } from "./ContextOrders";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLConstraintValue } from "./ConstraintValue";
import { CCBLEvent } from "./Event";
let clock = new CCBLTestClock();
const env = new CCBLEnvironmentExecution(clock);
function getStateContext(expression, env) {
    return new CCBLContextState({
        environment: env,
        contextName: "pipo context",
        state: new CCBLStateInExecutionEnvironment({
            env, expression, stateName: "pipo"
        })
    });
}
let emitterLight = new CCBLEmitterValue("unset");
let chanLight = createChannel(emitterLight);
function getProg_1() {
    let C = {
        Light: ["unset"],
        c_root: getStateContext("false", env),
        c_child_1: getStateContext("false", env),
        c_child_2: getStateContext("false", env),
        c_child_1_1: getStateContext("false", env),
        c_child_2_1: getStateContext("false", env),
        c_child_2_2: getStateContext("false", env),
        c_child_Constraint_1: getStateContext("false", env),
        c_child_Constraint_2: getStateContext("false", env),
        c_child_Constraint_3: getStateContext("false", env),
        stateActionRoot: new ChannelActionState(chanLight, env, `"off"`),
        stateActionChild_1: new ChannelActionState(chanLight, env, `"1"`),
        stateActionChild_2: new ChannelActionState(chanLight, env, `"2"`),
        stateActionChild_2_1: new ChannelActionState(chanLight, env, `"2.1"`),
        stateActionChild_2_2: new ChannelActionState(chanLight, env, `"2.2"`),
        stateConstraint_1: new ChannelActionState(chanLight, env, new CCBLConstraintValue(env, `concat("Constraint 1 applied to ", value)`)),
        stateConstraint_2: new ChannelActionState(chanLight, env, new CCBLConstraintValue(env, `concat("Constraint 2 applied to ", value)`)),
        stateConstraint_3: new ChannelActionState(chanLight, env, new CCBLConstraintValue(env, `concat("Constraint 3 applied to ", value)`)),
    };
    C.c_root.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_root, [C.c_child_1, C.c_child_Constraint_1, C.c_child_2, C.c_child_Constraint_2, C.c_child_Constraint_3])).appendChannelActions(C.stateActionRoot);
    C.c_child_1.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_child_1, [C.c_child_1_1]));
    C.c_child_2.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_child_2, [C.c_child_2_1, C.c_child_2_2])).appendChannelActions(C.stateActionChild_2);
    C.c_child_1.appendChannelActions(C.stateActionChild_1);
    C.c_child_2_1.appendChannelActions(C.stateActionChild_2_1);
    C.c_child_2_2.appendChannelActions(C.stateActionChild_2_2);
    C.c_child_Constraint_1.appendChannelActions(C.stateConstraint_1);
    C.c_child_Constraint_2.appendChannelActions(C.stateConstraint_2);
    C.c_child_Constraint_3.appendChannelActions(C.stateConstraint_3);
    StructuralOrder(C.c_root);
    return C;
}
describe("ChannelActionState: Program 1 exec 1 initialization:", () => {
    let C = getProg_1();
    let cb = (value) => {
        C.Light.splice(0, 0, value);
    };
    it("Program unactivated, Light should be unset", () => {
        chanLight.valueEmitter.on(cb);
        expect(C.Light[0] === "unset" && C.Light.length === 1).toBe(true);
    });
    it("Program activable, Light should stays unset", () => {
        C.c_root.setActivable(true);
        expect(C.Light[0] === "unset" && C.Light.length === 1).toBe(true);
    });
    it("Program activated, Light should be off", () => {
        C.c_root.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "off" && C.Light.length === 2).toBe(true);
    });
    it("c_child_1 activated, Light should becomes 1", () => {
        C.c_child_1.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "1" && C.Light.length === 3).toBe(true);
    });
    it("c_child_2 activated, Light should turns to 2", () => {
        C.c_child_2.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "2" && C.Light.length === 4).toBe(true);
    });
    it("c_child_2_2 activated, Light should turns to 2.2", () => {
        C.c_child_2_2.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "2.2" && C.Light.length === 5).toBe(true);
    });
    it("c_child_2 inactivated, Light should turns to 1", () => {
        C.c_child_2.state.setExpression("false");
        commitStateActions();
        expect(C.Light[0] === "1" && C.Light.length === 6).toBe(true);
    });
    it("c_root inactivated, Light should stays the same", () => {
        C.c_root.state.setExpression("false");
        commitStateActions();
        expect(C.Light[0] === "1" && C.Light.length === 6).toBe(true);
    });
    it("Program desactivated, Light should stays to 1", () => {
        C.c_root.state.setExpression("false");
        C.c_root.setActivable(false);
        commitStateActions();
        chanLight.valueEmitter.off(cb);
        expect(C.Light[0] === "1" && C.Light.length === 6).toBe(true);
    });
});
describe("ChannelActionState: Program 1 test of constraints:", () => {
    let C = getProg_1();
    let cb = (value) => {
        C.Light.splice(0, 0, value);
    };
    it("Program unactivated, Light should be unset", () => {
        chanLight.valueEmitter.set("unset");
        chanLight.valueEmitter.on(cb);
        expect(C.Light[0] === "unset" && C.Light.length === 1).toBe(true);
    });
    it("C1 => 1", () => {
        C.c_root.setActivable(true);
        C.c_root.state.setExpression("true");
        C.c_child_1.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "1" && C.Light.length === 2).toBe(true);
    });
    it(`Adding C.c_child_Constraint_1 => "Constraint 1 applied to 1".`, () => {
        C.c_child_Constraint_1.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "Constraint 1 applied to 1" && C.Light.length === 3).toBe(true);
    });
    it(`Adding C2 => 2".`, () => {
        C.c_child_2.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "2" && C.Light.length === 4).toBe(true);
    });
    it(`Adding C.c_child_Constraint_2 => "Constraint 2 applied to 2".`, () => {
        C.c_child_Constraint_2.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "Constraint 2 applied to 2" && C.Light.length === 5).toBe(true);
    });
    it(`Adding C.c_child_Constraint_3 => "Constraint 3 applied to Constraint 2 applied to 2".`, () => {
        C.c_child_Constraint_3.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "Constraint 3 applied to Constraint 2 applied to 2" && C.Light.length === 6).toBe(true);
    });
    it(`Removing C.c_child_Constraint_2 => "Constraint 3 applied to 2".`, () => {
        C.c_child_Constraint_2.state.setExpression("false");
        commitStateActions();
        expect(C.Light[0] === "Constraint 3 applied to 2" && C.Light.length === 7).toBe(true);
    });
    it(`Adding C.c_child_Constraint_2 => "Constraint 2 applied to 2".`, () => {
        C.c_child_Constraint_2.state.setExpression("true");
        commitStateActions();
        expect(C.Light[0] === "Constraint 3 applied to Constraint 2 applied to 2" && C.Light.length === 8).toBe(true);
    });
    it(`Removing C.c_child_Constraint_3 => "Constraint 2 applied to 2".`, () => {
        C.c_child_Constraint_3.state.setExpression("false");
        commitStateActions();
        expect(C.Light[0] === "Constraint 2 applied to 2" && C.Light.length === 9).toBe(true);
    });
    it("Program desactivated, Light should stays the same", () => {
        C.c_root.state.setExpression("false");
        C.c_root.setActivable(false);
        commitStateActions();
        chanLight.valueEmitter.off(cb);
        expect(C.Light[0] === "Constraint 2 applied to 2" && C.Light.length === 9).toBe(true);
    });
});
describe("Test about state and action interpolation", () => {
    const clock = new CCBLTestClock();
    const env = new CCBLEnvironmentExecution(clock);
    const CHAN = getNewChannel(undefined);
    env.register_Channel("CHAN", CHAN);
    registerChannel(CHAN);
    const rootContext = getStateContext("true", env);
    const childContext = getStateContext("true; false; 2000; waitEnd", env);
    rootContext.appendChannelActions(new ChannelActionState(CHAN, env, `0`));
    childContext.appendChannelActions(new ChannelActionState(CHAN, env, `0; 100; 1000; linear`));
    rootContext.appendParentOfAllenRelationships(new CCBLAllenDuring(rootContext, [childContext]));
    StructuralOrder(rootContext);
    it("clock=0 : Should starts at 0", () => {
        clock.goto(0);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(false);
        expect(CHAN.getValueEmitter().get()).toBeUndefined();
    });
    it("clock=500: Should stays at 0", () => {
        clock.goto(500);
        rootContext.setActivable();
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual(0);
    });
    it("clock=1000 : Should be 50 (interpolation from 500:0 to 1500:100)", () => {
        clock.goto(1000);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual(50);
    });
    it("clock=1500 : Should be 100 (interpolation from 500:0 to 1500:100)", () => {
        clock.goto(1500);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual(100);
    });
    it("clock=2000 : Should stay 100 (interpolation from 500:0 to 1500:100), state valid from 500 to 2500", () => {
        clock.goto(2000);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual(100);
    });
    it("clock=2499 : Should stay 100 (interpolation from 500:0 to 1500:100), state valid from 500 to 2500", () => {
        clock.goto(2499);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual(100);
    });
    it("clock=2501 : Should go back to 0 as state is no longer active (active only from 500 to 2500)", () => {
        clock.goto(2501);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual(0);
    });
});
describe("Test V>10 for 10s min", () => {
    const clock = new CCBLTestClock();
    const env = new CCBLEnvironmentExecution(clock);
    const V = getNewChannel(5);
    env.register_Channel("V", V);
    registerChannel(V);
    const VSup10For10s = getNewChannel(undefined);
    env.register_Channel("VSup10For10s", VSup10For10s);
    registerChannel(VSup10For10s);
    const CHAN = getNewChannel(undefined);
    env.register_Channel("CHAN", CHAN);
    registerChannel(CHAN);
    const rootContext = getStateContext("true", env);
    const childContextVSup10 = getStateContext("V > 10", env);
    const childContextBanco = getStateContext("VSup10For10s", env);
    rootContext.appendChannelActions(new ChannelActionState(CHAN, env, `"no no no"`), new ChannelActionState(VSup10For10s, env, `false`));
    childContextVSup10.appendChannelActions(new ChannelActionState(VSup10For10s, env, `false; true; 10000; waitEnd`));
    childContextBanco.appendChannelActions(new ChannelActionState(CHAN, env, `"banco!"`));
    rootContext.appendParentOfAllenRelationships(new CCBLAllenDuring(rootContext, [childContextVSup10, childContextBanco]));
    StructuralOrder(rootContext);
    it("clock=0 : init OK", () => {
        clock.goto(0);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(false);
        expect(CHAN.getValueEmitter().get()).toBeUndefined();
        expect(VSup10For10s.getValueEmitter().get()).toBeUndefined();
        expect(V.getValueEmitter().get()).toEqual(5);
    });
    it("clock=200, V=5 => false, no no no", () => {
        rootContext.setActivable();
        clock.goto(200);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(5);
    });
    it("clock=20000, V=5 => false, no no no", () => {
        clock.goto(20000);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(5);
    });
    it("clock=30000, V=15 : false, no no no", () => {
        clock.goto(30000);
        V.getValueEmitter().set(15);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(15);
    });
    it("clock=39999, V=15 : false, no no no", () => {
        clock.goto(39999);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(15);
    });
    it("clock=40000, V=15 : true, banco!", () => {
        clock.goto(40000);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("banco!");
        expect(VSup10For10s.getValueEmitter().get()).toBe(true);
        expect(V.getValueEmitter().get()).toEqual(15);
    });
    it("clock=45000, V=12 : true, banco!", () => {
        clock.goto(45000);
        V.getValueEmitter().set(12);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("banco!");
        expect(VSup10For10s.getValueEmitter().get()).toBe(true);
        expect(V.getValueEmitter().get()).toEqual(12);
    });
    it("clock=50000, V=9 : false, no no no", () => {
        clock.goto(50000);
        V.getValueEmitter().set(9);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(9);
    });
    it("clock=51000, V=11 : false, no no no", () => {
        clock.goto(51000);
        V.getValueEmitter().set(11);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(11);
    });
    it("clock=60999, V=11 : false, no no no", () => {
        clock.goto(60999);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("no no no");
        expect(VSup10For10s.getValueEmitter().get()).toBe(false);
        expect(V.getValueEmitter().get()).toEqual(11);
    });
    it("clock=61000, V=11 : false, no no no", () => {
        clock.goto(61000);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("banco!");
        expect(VSup10For10s.getValueEmitter().get()).toBe(true);
        expect(V.getValueEmitter().get()).toEqual(11);
    });
});
describe("Duration state 2000 plus start event :", () => {
    const clock = new CCBLTestClock();
    const env = new CCBLEnvironmentExecution(clock);
    const CHAN = getNewChannel(undefined);
    env.register_Channel("CHAN", CHAN);
    registerChannel(CHAN);
    const rootContext = getStateContext("true", env);
    const childContext = new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            env, expression: "true; false; 2000; waitEnd", stateName: "pipo"
        }),
        eventStart: new CCBLEvent({ eventName: "start event", env }),
        eventFinish: new CCBLEvent({ eventName: "end event", env }),
    });
    rootContext.appendChannelActions(new ChannelActionState(CHAN, env, `"outside"`));
    childContext.appendChannelActions(new ChannelActionState(CHAN, env, `"inside"`));
    rootContext.appendParentOfAllenRelationships(new CCBLAllenDuring(rootContext, [childContext]));
    StructuralOrder(rootContext);
    it("clock=0, not activated => undefined", () => {
        clock.goto(0);
        commitStateActions();
        expect(rootContext.getActive()).toEqual(false);
        expect(CHAN.getValueEmitter().get()).toBeUndefined();
    });
    it("clock=1000, activated => outside", () => {
        clock.goto(1000);
        rootContext.setActivable();
        commitStateActions();
        expect(rootContext.getActive()).toEqual(true);
        expect(CHAN.getValueEmitter().get()).toEqual("outside");
    });
    it("clock=2000 => outside", () => {
        clock.goto(2000);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("outside");
    });
    it("clock=3000, start event => inside", () => {
        clock.goto(3000);
        childContext.eventStart.trigger({ value: "start" });
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=4999 => inside", () => {
        clock.goto(4999);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=5000 => outside", () => {
        clock.goto(5000);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("outside");
    });
    it("clock=6000, start event => inside", () => {
        clock.goto(6000);
        childContext.eventStart.trigger({ value: "start" });
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=7999 => inside", () => {
        clock.goto(7999);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=8000 => outside", () => {
        clock.goto(8000);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("outside");
    });
    it("clock=9000, start event => inside", () => {
        clock.goto(9000);
        childContext.eventStart.trigger({ value: "start" });
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=10000, start event => inside", () => {
        clock.goto(10000);
        childContext.eventStart.trigger({ value: "start" });
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=11999 => inside", () => {
        clock.goto(11999);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("inside");
    });
    it("clock=12000 => inside", () => {
        clock.goto(12000);
        commitStateActions();
        expect(CHAN.getValueEmitter().get()).toEqual("outside");
    });
});
//# sourceMappingURL=ChannelActionState.spec.js.map