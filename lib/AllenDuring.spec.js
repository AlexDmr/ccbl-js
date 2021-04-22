import { CCBLContextState } from "./ContextState";
import { CCBLTestClock } from "./Clock";
import { CCBLAllenDuring } from "./AllenDuring";
import { CCBLStateInExecutionEnvironment } from "./StateInExecutionEnvironment";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
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
function getAllenConfBool() {
    let parent = getStateContext("false", env);
    let children = [
        getStateContext("false", env),
        getStateContext("false", env),
        getStateContext("false", env)
    ];
    let allen = new CCBLAllenDuring(parent, children);
    return { allen: allen, parent: parent, children: children };
}
describe("AllenDuring initialization:", () => {
    let { parent: parent, children: children } = getAllenConfBool();
    let [c1] = children;
    it("Context is not activable", () => expect(parent.getActivable()).toBe(false));
    it("Context is not activated", () => expect(parent.getActive()).toBe(false));
    it("SubContexts are not activables", () => {
        expect(children.reduce((acc, c) => acc || c.getActivable(), false)).toBe(false);
    });
    it("SubContexts are not actives", () => {
        expect(children.reduce((acc, c) => acc || c.getActive(), false)).toBe(false);
    });
    it("After parent becomes activable, parent is not active", () => {
        parent.setActivable(true);
        expect(parent.getActive()).toBe(false);
    });
    it("After parent becomes activable, subcontexts are not activables", () => {
        expect(children.reduce((acc, c) => acc || c.getActivable(), false)).toBe(false);
    });
    it("After parent becomes activable, subcontexts are not actives", () => {
        expect(children.reduce((acc, c) => acc || c.getActive(), false)).toBe(false);
    });
    it("After state becomes active, parent is active", () => {
        parent.state.setExpression("true");
        expect(parent.getActive()).toBe(true);
    });
    it("After state becomes active, subcontext are activables", () => {
        let res = children.reduce((acc, c) => acc && c.getActivable(), true);
        expect(res).toBe(true);
    });
    it("After state becomes active, subcontext are inactives", () => {
        let res = children.reduce((acc, c) => acc || c.getActive(), false);
        expect(res).toBe(false);
    });
    it("c1 active", () => {
        c1.state.setExpression("true");
        expect(c1.getActive()).toBe(true);
    });
    it("parent inactive => c1 inactive and inactivable", () => {
        parent.state.setExpression("false");
        expect(c1.getActive() || c1.getActivable()).toBe(false);
    });
    it("parent active => c1 active and activable", () => {
        parent.state.setExpression("true");
        expect(c1.getActive() && c1.getActivable()).toBe(true);
    });
});
//# sourceMappingURL=AllenDuring.spec.js.map