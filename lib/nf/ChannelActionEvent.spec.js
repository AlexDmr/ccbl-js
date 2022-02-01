import { CCBLTestClock } from "./Clock";
import { ChannelActionState } from "./ChannelActionState";
import { commitStateActions, createChannel, registerChannel } from "./Channel";
import { CCBLContextState } from "./ContextState";
import { CCBLAllenDuring } from "./AllenDuring";
import { StructuralOrder } from "./ContextOrders";
import { CCBLContextEvent } from "./ContextEvent";
import { CCBLEvent } from "./Event";
import { ChannelActionEvent } from "./ChannelActionEvent";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLConstraintValue } from "./ConstraintValue";
let clock = new CCBLTestClock();
const env = new CCBLEnvironmentExecution(clock);
function getStateContext(expression, env) {
    return new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            env, expression, stateName: "pipo"
        })
    });
}
function getEventContext() {
    return new CCBLContextEvent("pipo context", new CCBLEvent({ env, eventName: "pipoEvt" }));
}
let emitterVolume = new CCBLEmitterValue(-1);
let chanVolume = createChannel(emitterVolume);
env.register_Channel("chanVolume", chanVolume);
registerChannel(chanVolume);
function getProg_2() {
    let C = {
        Volume: [-1],
        c_root: getStateContext("false", env),
        c_child_1: getStateContext("false", env),
        c_child_2: getStateContext("false", env),
        c_child_1_1: getStateContext("false", env),
        c_child_event_2_0: getEventContext(),
        c_child_state_2_1: getStateContext("false", env),
        c_child_event_2_2: getEventContext(),
        c_child_event_2_3: getEventContext(),
        c_child_state_2_4: getStateContext("false", env),
        c_child_Constraint_1: getStateContext("false", env),
        c_child_Constraint_2: getStateContext("false", env),
        c_child_Constraint_3: getStateContext("false", env),
        stateActionRoot: new ChannelActionState(chanVolume, env, "0"),
        stateActionChild_1: new ChannelActionState(chanVolume, env, "50"),
        stateActionChild_2: new ChannelActionState(chanVolume, env, "100"),
        stateActionChild_2_1: new ChannelActionState(chanVolume, env, "70"),
        stateActionChild_2_4: new ChannelActionState(chanVolume, env, "90"),
        stateConstraint_1: new ChannelActionState(chanVolume, env, new CCBLConstraintValue(env, "min(value, 20)")),
        stateConstraint_2: new ChannelActionState(chanVolume, env, new CCBLConstraintValue(env, "max(value, 60)")),
        stateConstraint_3: new ChannelActionState(chanVolume, env, new CCBLConstraintValue(env, "value ^ 2")),
        eventAction_2_0: new ChannelActionEvent(chanVolume, env, "chanVolume + 1"),
        eventAction_2_2: new ChannelActionEvent(chanVolume, env, "chanVolume + 2"),
        eventAction_2_3: new ChannelActionEvent(chanVolume, env, "chanVolume + 3")
    };
    C.c_root.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_root, [C.c_child_1, C.c_child_Constraint_1, C.c_child_2, C.c_child_Constraint_2, C.c_child_Constraint_3])).appendChannelActions(C.stateActionRoot);
    C.c_child_1.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_child_1, [C.c_child_1_1]));
    C.c_child_2.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_child_2, [C.c_child_event_2_0, C.c_child_state_2_1, C.c_child_event_2_2, C.c_child_event_2_3, C.c_child_state_2_4])).appendChannelActions(C.stateActionChild_2);
    C.c_child_event_2_0.appendChannelActions(C.eventAction_2_0);
    C.c_child_event_2_2.appendChannelActions(C.eventAction_2_2);
    C.c_child_event_2_3.appendChannelActions(C.eventAction_2_3);
    C.c_child_1.appendChannelActions(C.stateActionChild_1);
    C.c_child_state_2_1.appendChannelActions(C.stateActionChild_2_1);
    C.c_child_state_2_4.appendChannelActions(C.stateActionChild_2_4);
    C.c_child_Constraint_1.appendChannelActions(C.stateConstraint_1);
    C.c_child_Constraint_2.appendChannelActions(C.stateConstraint_2);
    C.c_child_Constraint_3.appendChannelActions(C.stateConstraint_3);
    StructuralOrder(C.c_root);
    return C;
}
describe("ChannelActionEvent: Program 2 initialization:", () => {
    let C = getProg_2();
    let cb = (value) => {
        C.Volume.splice(0, 0, value);
    };
    it("Program unactivated, Volume should be unset", () => {
        chanVolume.valueEmitter.set(-1);
        chanVolume.valueEmitter.on(cb);
        expect(C.Volume[0]).toEqual(-1);
        expect(C.Volume.length).toEqual(1);
    });
    it("C1 => 50", () => {
        C.c_root.setActivable(true);
        C.c_root.state.setExpression("true");
        C.c_child_1.state.setExpression("true");
        commitStateActions();
        expect(C.Volume[0]).toEqual(50);
    });
    it("c_child_event_2_0 => nothing", () => {
        C.c_child_event_2_0.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 50 && C.Volume.length === 2).toBe(true);
    });
    it("C2 => 100", () => {
        C.c_child_2.state.setExpression("true");
        commitStateActions();
        expect(C.Volume[0] === 100 && C.Volume.length === 3).toBe(true);
    });
    it("c_child_event_2_0 => 100+1=101", () => {
        C.c_child_event_2_0.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0]).toEqual(101);
        expect(C.Volume.length).toEqual(4);
    });
    it("c_child_event_2_0 => 101+1=102", () => {
        C.c_child_event_2_0.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 102 && C.Volume.length === 5).toBe(true);
    });
    it("c_child_event_2_2 => 102+2=104", () => {
        C.c_child_event_2_2.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 104 && C.Volume.length === 6).toBe(true);
    });
    it("c_child_event_2_3 => 104+3=107", () => {
        C.c_child_event_2_3.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 107 && C.Volume.length === 7).toBe(true);
    });
    it("c_child_state_2_1 => 70", () => {
        C.c_child_state_2_1.state.setExpression("true");
        commitStateActions();
        expect(C.Volume[0] === 70 && C.Volume.length === 8).toBe(true);
    });
    it("c_child_event_2_0 => nothing (hidden by c_child_state_2_1", () => {
        C.c_child_event_2_0.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 70 && C.Volume.length === 8).toBe(true);
    });
    it("c_child_event_2_2 => 70+2=72", () => {
        C.c_child_event_2_2.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 72 && C.Volume.length === 9).toBe(true);
    });
    it("c_child_event_2_3 => 72+3=75", () => {
        C.c_child_event_2_3.event.trigger({ value: true });
        commitStateActions();
        expect(C.Volume[0] === 75 && C.Volume.length === 10).toBe(true);
    });
});
//# sourceMappingURL=ChannelActionEvent.spec.js.map