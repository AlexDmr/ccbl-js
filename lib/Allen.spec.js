import { CCBLTestClock } from "./Clock";
import { ChannelActionState } from "./ChannelActionState";
import { commitStateActions, createChannel, registerChannel } from "./Channel";
import { CCBLContextState } from "./ContextState";
import { CCBLAllenDuring } from "./AllenDuring";
import { StructuralOrder } from "./ContextOrders";
import { CCBLEmitterValue } from "./EmitterValue";
import { CCBLAllenStartWith } from "./AllenStartWith";
import { CCBLAllenEndWith } from "./AllenEndWith";
import { CCBLEvent } from "./Event";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLAllenMeet } from "./AllenMeet";
let clock = new CCBLTestClock();
let env = new CCBLEnvironmentExecution(clock);
function getEndContext() {
    return new CCBLContextState({
        environment: env,
        contextName: "pipo",
        eventStart: new CCBLEvent({ env, eventName: "pipoEvt" })
    });
}
function getStateContext(expression, env) {
    return new CCBLContextState({
        environment: env,
        contextName: "pipo",
        state: new CCBLStateInExecutionEnvironment({
            env, expression, stateName: "pipo"
        })
    });
}
let emitterInfo = new CCBLEmitterValue("");
let chanInfo = createChannel(emitterInfo);
registerChannel(chanInfo);
function getProg_Allen() {
    let C = {
        Info: [],
        c_root: getStateContext("false", env),
        c_root_StartWith: getStateContext("false", env),
        c_root_EndWith: getEndContext(),
        c_root_During: getStateContext("false", env),
        c_root_During_StartWith: getStateContext("false", env),
        c_root_During_EndWith: getEndContext(),
        c_root_During_During: getStateContext("false", env),
    };
    C.c_root.appendParentOfAllenRelationships(new CCBLAllenStartWith(C.c_root, [C.c_root_StartWith]), new CCBLAllenDuring(C.c_root, [C.c_root_During]), new CCBLAllenEndWith(C.c_root, [C.c_root_EndWith])).appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root"`));
    C.c_root_During.appendParentOfAllenRelationships(new CCBLAllenStartWith(C.c_root_During, [C.c_root_During_StartWith]), new CCBLAllenDuring(C.c_root_During, [C.c_root_During_During]), new CCBLAllenEndWith(C.c_root_During, [C.c_root_During_EndWith])).appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root_During"`));
    C.c_root_StartWith.appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root_StartWith"`));
    C.c_root_EndWith.appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root_EndWith"`));
    C.c_root_During_StartWith.appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root_During_StartWith"`));
    C.c_root_During_EndWith.appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root_During_EndWith"`));
    C.c_root_During_During.appendChannelActions(new ChannelActionState(chanInfo, env, `"c_root_During_During"`));
    StructuralOrder(C.c_root);
    return C;
}
describe("Allen:", () => {
    let C = getProg_Allen();
    let cbVInfo = (value) => {
        C.Info.splice(0, 0, value);
    };
    it("Program Allen unactivated, Info should be unset", () => {
        chanInfo.valueEmitter.on(cbVInfo);
        expect(C.Info.length).toEqual(0);
    });
    it("root => c_root", () => {
        C.c_root.setActivable(true);
        C.c_root.state.setExpression("true");
        commitStateActions();
        expect(C.Info[0]).toEqual("c_root");
    });
    it("root => c_root_StartWith not activable", () => expect(C.c_root_StartWith.getActivable()).toBe(false));
    it("root => c_root_During activable", () => expect(C.c_root_During.getActivable()).toBe(true));
    it("root => c_root_EndWith activable", () => expect(C.c_root_EndWith.getActivable()).toBe(true));
    it("c_root_During_StartWith && c_root_During => Info contains now 2 values", () => {
        C.c_root_During_StartWith.state.setExpression("true");
        C.c_root_During.state.setExpression("true");
        commitStateActions();
        expect(C.Info.length).toEqual(2);
    });
    it("c_root_During_StartWith && c_root_During => c_root_During_During", () => expect(C.Info[0]).toEqual("c_root_During_StartWith"));
    it("c_root_During_During => nothing change", () => {
        C.c_root_During_During.state.setExpression("true");
        commitStateActions();
        expect(C.Info.length).toEqual(2);
    });
    it("c_root_During_StartWith ends => Info contains now 3 values", () => {
        C.c_root_During_StartWith.state.setExpression("false");
        commitStateActions();
        expect(C.Info.length).toEqual(3);
    });
    it("c_root_During_StartWith ends => c_root_During_During", () => expect(C.Info[0]).toEqual("c_root_During_During"));
    it("c_root_EndWith => Info contains now 4 values", () => {
        C.c_root_EndWith.eventStart.trigger({ value: true });
        commitStateActions();
        expect(C.Info.length).toEqual(4);
    });
    it("c_root_EndWith => c_root_During_During", () => expect(C.Info[0]).toEqual("c_root_EndWith"));
    it("c_root_During_EndWith => nothing change", () => {
        C.c_root_During_EndWith.eventStart.trigger({ value: true });
        commitStateActions();
        expect(C.Info.length).toEqual(4);
    });
});
describe("Allen with Meet:", () => {
    let clock = new CCBLTestClock();
    let env = new CCBLEnvironmentExecution(clock);
    const rootContext = getStateContext("true", env);
    const duringContext = getStateContext("true", env);
    const afterDuring1 = getStateContext("true", env);
    const afterDuring2 = getStateContext("true", env);
    const startContext = getStateContext("true", env);
    const afterStart1 = getStateContext("true", env);
    const afterStart2 = getStateContext("true", env);
    rootContext.appendParentOfAllenRelationships(new CCBLAllenStartWith(rootContext, [startContext]), new CCBLAllenDuring(rootContext, [duringContext]));
    duringContext.appendParentOfAllenRelationships(new CCBLAllenMeet(duringContext, [afterDuring1]));
    afterDuring1.appendParentOfAllenRelationships(new CCBLAllenMeet(afterDuring1, [afterDuring2]));
    startContext.appendParentOfAllenRelationships(new CCBLAllenMeet(startContext, [afterStart1]));
    afterStart1.appendParentOfAllenRelationships(new CCBLAllenMeet(afterStart1, [afterStart2]));
    StructuralOrder(rootContext);
    rootContext.setActivable();
    commitStateActions();
    it("Activables should be [rootContext, duringContext, startContext]", () => {
        expect(rootContext.getActivable() && rootContext.getActive()).toBe(true);
        expect(duringContext.getActivable() && duringContext.getActive()).toBe(true);
        expect(afterDuring1.getActivable() || afterDuring1.getActive()).toBe(false);
        expect(afterDuring2.getActivable() || afterDuring2.getActive()).toBe(false);
        expect(startContext.getActivable() && startContext.getActive()).toBe(true);
        expect(afterStart1.getActivable() || afterStart1.getActive()).toBe(false);
        expect(afterStart2.getActivable() || afterStart2.getActive()).toBe(false);
    });
    it("startContext becomes inactive => startContext becomes inactivable and afterStart1 becomes active", () => {
        startContext.state.setExpression("false");
        commitStateActions();
        expect(startContext.getActivable() || startContext.getActive()).toBe(false);
        expect(afterStart1.getActivable() && afterStart1.getActive()).toBe(true);
        expect(afterStart2.getActivable() || afterStart2.getActive()).toBe(false);
    });
    it("afterStart1 becomes inactive => afterStart1 becomes inactivable and afterStart2 becomes active", () => {
        afterStart1.state.setExpression("false");
        commitStateActions();
        expect(startContext.getActivable() || startContext.getActive()).toBe(false);
        expect(afterStart1.getActivable() || afterStart1.getActive()).toBe(false);
        expect(afterStart2.getActivable() && afterStart2.getActive()).toBe(true);
    });
    it("afterStart2 becomes inactive => afterStart2 becomes inactivable and startContext not activable", () => {
        afterStart2.state.setExpression("false");
        commitStateActions();
        expect(startContext.getActivable() || startContext.getActive()).toBe(false);
        expect(afterStart1.getActivable() || afterStart1.getActive()).toBe(false);
        expect(afterStart2.getActivable() || afterStart2.getActive()).toBe(false);
    });
    it("duringContext becomes inactive => duringContext becomes inactivable and afterDuring1 becomes active", () => {
        duringContext.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable() || duringContext.getActive()).toBe(false);
        expect(afterDuring1.getActivable() && afterDuring1.getActive()).toBe(true);
        expect(afterDuring2.getActivable() || afterDuring2.getActive()).toBe(false);
    });
    it("afterDuring1 becomes inactive => afterDuring1 becomes inactivable and afterDuring2 becomes active", () => {
        afterDuring1.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable() || duringContext.getActive()).toBe(false);
        expect(afterDuring1.getActivable() || afterDuring1.getActive()).toBe(false);
        expect(afterDuring2.getActivable() && afterDuring2.getActive()).toBe(true);
    });
    it("afterDuring2 becomes inactive => afterDuring2 becomes inactivable and duringContext becomes activable but inactive", () => {
        afterDuring2.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable() && !duringContext.getActive()).toBe(true);
        expect(afterDuring1.getActivable() || afterDuring1.getActive()).toBe(false);
        expect(afterDuring2.getActivable() || afterDuring2.getActive()).toBe(false);
    });
    it("duringContext and following becomes active => OK", () => {
        duringContext.state.setExpression("true");
        afterDuring1.state.setExpression("true");
        afterDuring2.state.setExpression("true");
        commitStateActions();
        expect(duringContext.getActivable() && duringContext.getActive()).toBe(true);
        expect(afterDuring1.getActivable() || afterDuring1.getActive()).toBe(false);
        expect(afterDuring2.getActivable() || afterDuring2.getActive()).toBe(false);
    });
    it("duringContext becomes inactive => duringContext becomes inactivable and afterDuring1 becomes active", () => {
        duringContext.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable() || duringContext.getActive()).toBe(false);
        expect(afterDuring1.getActivable() && afterDuring1.getActive()).toBe(true);
        expect(afterDuring2.getActivable() || afterDuring2.getActive()).toBe(false);
    });
    it("rootContext becomes inactive => subcontexts inactivables", () => {
        rootContext.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable()).toBe(false);
        expect(afterDuring1.getActivable()).toBe(false);
        expect(afterDuring2.getActivable()).toBe(false);
        expect(startContext.getActivable()).toBe(false);
        expect(afterStart1.getActivable()).toBe(false);
        expect(afterStart2.getActivable()).toBe(false);
    });
    it("rootContext becomes inactive => subcontexts in the same initiale state", () => {
        startContext.state.setExpression("true");
        rootContext.state.setExpression("true");
        commitStateActions();
        expect(duringContext.getActivable()).toBe(true);
        expect(afterDuring1.getActivable()).toBe(false);
        expect(afterDuring2.getActivable()).toBe(false);
        expect(startContext.getActivable()).toBe(true);
        expect(afterStart1.getActivable()).toBe(false);
        expect(afterStart2.getActivable()).toBe(false);
    });
    it("duringContext becomes inactive, after1 is inactive => duringContext stays activable", () => {
        duringContext.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable()).toBe(true);
        expect(afterDuring1.getActivable()).toBe(false);
        expect(afterDuring2.getActivable()).toBe(false);
        expect(startContext.getActivable()).toBe(true);
        expect(afterStart1.getActivable()).toBe(false);
        expect(afterStart2.getActivable()).toBe(false);
    });
    it("during and after1 becomes true => during is active and after is not activable", () => {
        duringContext.state.setExpression("true");
        afterDuring1.state.setExpression("true");
        afterDuring2.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable() && duringContext.getActive()).toBe(true);
        expect(afterDuring1.getActivable()).toBe(false);
        expect(afterDuring2.getActivable()).toBe(false);
        expect(startContext.getActivable()).toBe(true);
        expect(afterStart1.getActivable()).toBe(false);
        expect(afterStart2.getActivable()).toBe(false);
    });
    it("during becomes false => during is inactive and after is not activable", () => {
        duringContext.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable()).toBe(false);
        expect(afterDuring1.getActivable() && afterDuring1.getActive()).toBe(true);
        expect(afterDuring2.getActivable()).toBe(false);
        expect(startContext.getActivable()).toBe(true);
        expect(afterStart1.getActivable()).toBe(false);
        expect(afterStart2.getActivable()).toBe(false);
    });
    it("after1 becomes false => during become activable as after2 is false, after1 becomes inactive", () => {
        afterDuring1.state.setExpression("false");
        commitStateActions();
        expect(duringContext.getActivable()).toBe(true);
        expect(afterDuring1.getActivable()).toBe(false);
        expect(afterDuring2.getActivable()).toBe(false);
        expect(startContext.getActivable()).toBe(true);
        expect(afterStart1.getActivable()).toBe(false);
        expect(afterStart2.getActivable()).toBe(false);
    });
});
describe("Allen with Meet and cycle C1-C2-C3-C2 each Ci take 1s:", () => {
    let clock = new CCBLTestClock();
    let env = new CCBLEnvironmentExecution(clock);
    const rootContext = getStateContext("true", env);
    const C1 = getStateContext("true; false; 1000; waitEnd", env);
    const C2 = getStateContext("true; false; 1000; waitEnd", env);
    const C3 = getStateContext("true; false; 1000; waitEnd", env);
    rootContext.appendParentOfAllenRelationships(new CCBLAllenDuring(rootContext, [C1]));
    C1.appendParentOfAllenRelationships(new CCBLAllenMeet(C1, [C2]));
    C2.appendParentOfAllenRelationships(new CCBLAllenMeet(C2, [C3]));
    C3.appendParentOfAllenRelationships(new CCBLAllenMeet(C3, [C2]));
    StructuralOrder(rootContext);
    rootContext.setActivable();
    commitStateActions();
    it("t0 -> C1", () => {
        expect(rootContext.getActivable() && rootContext.getActive()).toBe(true);
        expect(C1.getActivable() && C1.getActive()).toBe(true);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t1000 -> C2", () => {
        clock.goto(1000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t2000 -> C3", () => {
        clock.goto(2000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() && C3.getActive()).toBe(true);
    });
    it("t3000 -> C2", () => {
        clock.goto(3000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t3100, root false -> all inactive", () => {
        clock.goto(3100);
        rootContext.setActivable(false);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t4000, root true -> C1", () => {
        clock.goto(4000);
        rootContext.setActivable(true);
        expect(C1.getActivable() && C1.getActive()).toBe(true);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t5000 -> C2", () => {
        clock.goto(5000);
        rootContext.setActivable(true);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t6000 -> C3", () => {
        clock.goto(6000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() && C3.getActive()).toBe(true);
    });
    it("t7000 -> C2", () => {
        clock.goto(7000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
});
describe("Allen with Meet NO CYCLE C1-C2-C3 each Ci take 1s:", () => {
    let clock = new CCBLTestClock();
    let env = new CCBLEnvironmentExecution(clock);
    const rootContext = getStateContext("true", env);
    const C1 = getStateContext("true; false; 1000; waitEnd", env);
    const C2 = getStateContext("true; false; 1000; waitEnd", env);
    const C3 = getStateContext("true; false; 1000; waitEnd", env);
    rootContext.appendParentOfAllenRelationships(new CCBLAllenDuring(rootContext, [C1]));
    C1.appendParentOfAllenRelationships(new CCBLAllenMeet(C1, [C2]));
    C2.appendParentOfAllenRelationships(new CCBLAllenMeet(C2, [C3]));
    StructuralOrder(rootContext);
    rootContext.setActivable();
    commitStateActions();
    it("t0 -> C1", () => {
        expect(rootContext.getActivable() && rootContext.getActive()).toBe(true);
        expect(C1.getActivable() && C1.getActive()).toBe(true);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t1000 -> C2", () => {
        clock.goto(1000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t2000 -> C3", () => {
        clock.goto(2000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() && C3.getActive()).toBe(true);
    });
    it("t3000 -> C1", () => {
        clock.goto(3000);
        expect(C1.getActivable() && C1.getActive()).toBe(true);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t4000 -> C2", () => {
        clock.goto(4000);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t4100, root false -> all inactive", () => {
        clock.goto(4100);
        rootContext.setActivable(false);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t5000, root true -> C1", () => {
        clock.goto(5000);
        rootContext.setActivable(true);
        expect(C1.getActivable() && C1.getActive()).toBe(true);
        expect(C2.getActivable() || C2.getActive()).toBe(false);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
    it("t6000 -> C2", () => {
        clock.goto(6000);
        rootContext.setActivable(true);
        expect(C1.getActivable() || C1.getActive()).toBe(false);
        expect(C2.getActivable() && C2.getActive()).toBe(true);
        expect(C3.getActivable() || C3.getActive()).toBe(false);
    });
});
//# sourceMappingURL=Allen.spec.js.map