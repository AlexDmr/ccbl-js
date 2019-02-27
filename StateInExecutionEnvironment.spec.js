"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StateInExecutionEnvironment_1 = require("./StateInExecutionEnvironment");
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const Clock_1 = require("./Clock");
const EmitterValue_1 = require("./EmitterValue");
const Channel_1 = require("./Channel");
const clock = new Clock_1.CCBLTestClock();
const env = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
env.register_CCBLEmitterValue("externalTemp", new EmitterValue_1.CCBLEmitterValue(23));
env.register_Channel("internalTemp", new Channel_1.Channel(new EmitterValue_1.CCBLEmitterValue(25)));
const emitterIsNight = new EmitterValue_1.CCBLEmitterValue(true);
const chanVarIsNight = new Channel_1.Channel(emitterIsNight);
env.register_Channel("isNight", chanVarIsNight);
describe(`CCBLStateInExecutionEnvironment creation: "externalTemp < internalTemp & isNight"`, () => {
    const state = new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
        env,
        expression: "externalTemp < internalTemp & isNight",
        stateName: "testState"
    });
    it("State is not listening", () => expect(state.isListening()).toBe(false));
    it("State is not active", () => expect(state.isEvaluatedTrue()).toBe(false));
});
describe(`CCBLStateInExecutionEnvironment listening: "externalTemp:23, internalTemp:25, isNight: true"`, () => {
    const state = new StateInExecutionEnvironment_1.CCBLStateInExecutionEnvironment({
        env,
        expression: "externalTemp < internalTemp & isNight",
        stateName: "testState"
    });
    state.listen(true);
    it("State is listening", () => {
        expect(state.isListening()).toBe(true);
    });
    it("State is active", () => {
        expect(state.isEvaluatedTrue()).toBe(true);
    });
    it("externalTemp from 23 to 27", () => {
        env.get_CCBLEmitterValue_FromId("externalTemp").set(27);
        expect(state.isEvaluatedTrue()).toBe(false);
    });
    it("internal temp from 25 to 30", () => {
        env.get_Channel_FromId("internalTemp").getValueEmitter().set(30);
        expect(state.isEvaluatedTrue()).toBe(true);
    });
    it("isNight becomes false", () => {
        emitterIsNight.set(false);
        expect(state.isEvaluatedTrue()).toBe(false);
    });
});
//# sourceMappingURL=StateInExecutionEnvironment.spec.js.map