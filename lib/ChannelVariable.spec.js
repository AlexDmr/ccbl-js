import { CCBLTestClock } from "./Clock";
import { ChannelActionState } from "./ChannelActionState";
import { Channel, commitStateActions, createChannel, registerChannel } from "./Channel";
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
        state: new CCBLStateInExecutionEnvironment({ env, expression, stateName: "pipo" })
    });
}
function getEventContext() {
    return new CCBLContextEvent("pipo context", new CCBLEvent({ env, eventName: "pipoEvt" }));
}
const emitterVolume = new CCBLEmitterValue(-1);
const chanVolume = createChannel(emitterVolume);
const emitterVarAlpha = new CCBLEmitterValue(0);
const chanVarAlpha = new Channel(emitterVarAlpha);
env.register_Channel("chanVarAlpha", chanVarAlpha);
registerChannel(chanVolume, chanVarAlpha);
function getProg_3() {
    let C = {
        Volume: [],
        Alpha: [],
        c_root: getStateContext("false", env),
        stateActionVar_root_Alpha: new ChannelActionState(chanVarAlpha, env, "7"),
        c_child_1: getStateContext("false", env),
        c_child_1_1: getStateContext("false", env),
        stateActionVar_c_child_1_1_Alpha: new ChannelActionState(chanVarAlpha, env, "33"),
        c_child_2: getStateContext("false", env),
        c_child_event_2_0: getEventContext(),
        c_child_state_2_1: getStateContext("false", env),
        c_child_event_2_2: getEventContext(),
        c_child_event_2_3: getEventContext(),
        c_child_state_2_4: getStateContext("false", env),
        c_child_Constraint_1: getStateContext("false", env),
        c_child_Constraint_2: getStateContext("false", env),
        c_child_Constraint_3: getStateContext("false", env),
        stateActionRoot: new ChannelActionState(chanVolume, env, "0"),
        stateActionChild_1: new ChannelActionState(chanVolume, env, "chanVarAlpha"),
        stateActionChild_1_1: new ChannelActionState(chanVarAlpha, env, "11"),
        stateActionChild_2: new ChannelActionState(chanVarAlpha, env, "100"),
        stateActionChild_2_1: new ChannelActionState(chanVarAlpha, env, "19"),
        stateActionChild_2_4: new ChannelActionState(chanVarAlpha, env, "90"),
        stateConstraint_1: new ChannelActionState(chanVolume, env, new CCBLConstraintValue(env, "min(value, 20)")),
        stateConstraint_2: new ChannelActionState(chanVolume, env, new CCBLConstraintValue(env, "max(value, 60)")),
        stateConstraint_3: new ChannelActionState(chanVolume, env, new CCBLConstraintValue(env, "value ^ 2")),
        eventAction_2_0: new ChannelActionEvent(chanVarAlpha, env, "chanVarAlpha + 1"),
        eventAction_2_2: new ChannelActionEvent(chanVarAlpha, env, "chanVarAlpha + 2"),
        eventAction_2_3: new ChannelActionEvent(chanVarAlpha, env, "chanVarAlpha + 3")
    };
    C.c_root.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_root, [C.c_child_1, C.c_child_Constraint_1, C.c_child_2, C.c_child_Constraint_2, C.c_child_Constraint_3])).appendChannelActions(C.stateActionRoot, C.stateActionVar_root_Alpha);
    C.c_child_1.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_child_1, [C.c_child_1_1])).appendChannelActions(C.stateActionChild_1, C.stateActionVar_c_child_1_1_Alpha);
    C.c_child_1_1.appendChannelActions(C.stateActionChild_1_1);
    C.c_child_2.appendParentOfAllenRelationships(new CCBLAllenDuring(C.c_child_2, [C.c_child_event_2_0, C.c_child_state_2_1, C.c_child_event_2_2, C.c_child_event_2_3, C.c_child_state_2_4])).appendChannelActions(C.stateActionChild_2);
    C.c_child_event_2_0.appendChannelActions(C.eventAction_2_0);
    C.c_child_event_2_2.appendChannelActions(C.eventAction_2_2);
    C.c_child_event_2_3.appendChannelActions(C.eventAction_2_3);
    C.c_child_state_2_1.appendChannelActions(C.stateActionChild_2_1);
    C.c_child_state_2_4.appendChannelActions(C.stateActionChild_2_4);
    C.c_child_Constraint_1.appendChannelActions(C.stateConstraint_1);
    C.c_child_Constraint_2.appendChannelActions(C.stateConstraint_2);
    C.c_child_Constraint_3.appendChannelActions(C.stateConstraint_3);
    StructuralOrder(C.c_root);
    return C;
}
describe("ChannelVariable: Program 3:", () => {
    let C = getProg_3();
    let cbVolume = (value) => {
        C.Volume.splice(0, 0, value);
    };
    let cbAlpha = (value) => {
        C.Alpha.splice(0, 0, value);
    };
    it("Program 3 unactivated, Volume and Alpha should be unset", () => {
        chanVolume.valueEmitter.set(-1);
        chanVolume.valueEmitter.on(cbVolume);
        chanVarAlpha.valueEmitter.on(cbAlpha);
        expect(C.Volume.length).toEqual(0);
        expect(C.Alpha.length).toEqual(0);
    });
    it("Program 3 activated => update Volume & Alpha", () => {
        C.c_root.setActivable(true);
        C.c_root.state.setExpression("true");
        commitStateActions();
        expect(C.Volume.length).toEqual(1);
        expect(C.Alpha.length).toEqual(1);
    });
    it("Program 3 activated => Volume === 0", () => {
        expect(C.Volume[0]).toEqual(0);
    });
    it("Program 3 activated => Alpha === 7", () => {
        expect(C.Alpha[0]).toEqual(7);
    });
    it("c_child_1 => update Volume & Alpha", () => {
        C.c_child_1.state.setExpression("true");
        commitStateActions();
        expect(C.Volume.length).toEqual(2);
        expect(C.Alpha.length).toEqual(2);
    });
    it("c_child_1 => Volume === 33", () => {
        expect(C.Volume[0]).toEqual(33);
    });
    it("c_child_1_1 => update Alpha and consequently Volume", () => {
        C.c_child_1_1.state.setExpression("true");
        commitStateActions();
        expect(C.Volume.length).toEqual(3);
        expect(C.Alpha.length).toEqual(3);
    });
    it("c_child_1 => Volume === 11", () => expect(C.Volume[0]).toEqual(11));
    it("c_child_1 => Alpha === 11", () => expect(C.Alpha[0]).toEqual(11));
    it("c_child_2 + c_child_Constraint_1 => Alpha === 100", () => {
        C.c_child_2.state.setExpression("true");
        C.c_child_Constraint_1.state.setExpression("true");
        commitStateActions();
        expect(C.Alpha[0]).toEqual(100);
    });
    it("c_child_2 + c_child_Constraint_1 => Volume === Math.min(100, 20)", () => expect(C.Volume[0]).toEqual(20));
    it("c_child_2_1 => Alpha === 19", () => {
        C.c_child_state_2_1.state.setExpression("true");
        commitStateActions();
        expect(C.Alpha[0]).toEqual(19);
    });
    it("c_child_2 + c_child_Constraint_1 => Volume === Math.min(19, 20)", () => expect(C.Volume[0]).toEqual(19));
    it("eventAction_2_2 trigger => Alpha === 21", () => {
        C.c_child_event_2_2.event.trigger({ value: true });
        commitStateActions();
        expect(C.Alpha[0]).toEqual(21);
    });
    it("eventAction_2_2 trigger => Volume === Math.min(21, 20)", () => expect(C.Volume[0]).toEqual(20));
    it("eventAction_2_2 trigger => Alpha === 23", () => {
        C.c_child_event_2_2.event.trigger({ value: true });
        commitStateActions();
        expect(C.Alpha[0]).toEqual(23);
    });
    it("eventAction_2_2 trigger => Volume === Math.min(20, 23)", () => expect(C.Volume[0]).toEqual(20));
    it("Program 3 desactivated", () => {
        C.c_root.setActivable(false);
        commitStateActions();
        expect(C.c_root.getActive()).toEqual(false);
    });
});
//# sourceMappingURL=ChannelVariable.spec.js.map