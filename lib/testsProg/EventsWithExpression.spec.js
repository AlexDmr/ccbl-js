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
    const B = new EmitterValue_1.CCBLEmitterValue(0);
    sourceEnv.registerCCBLEvent("EvtPlus", EvtPlus)
        .registerCCBLEvent("EvtMinus", EvtMinus)
        .register_CCBLEmitterValue("A", A)
        .register_CCBLEmitterValue("B", B);
    it("Loading program eventsWithExpression", () => {
        rootProg.loadHumanReadableProgram(P, sourceEnv, {});
        const CP = rootProg.toHumanReadableProgram();
        expect(ProgramObjectInterface_1.progEquivalent(P, CP)).toBe(true);
    });
});
//# sourceMappingURL=EventsWithExpression.spec.js.map