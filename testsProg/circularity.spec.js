"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Clock_1 = require("../Clock");
const ProgramObject_1 = require("../ProgramObject");
const ExecutionEnvironment_1 = require("../ExecutionEnvironment");
describe("Circular dependencies detection:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const env = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const prog = new ProgramObject_1.CCBLProgramObject("progCircular", clock);
    const subProg = {
        dependencies: {
            import: {
                emitters: [
                    { name: "E", type: "number" }
                ],
                channels: [
                    { name: "C", type: "number" },
                ]
            }
        },
        actions: [
            { channel: "C", affectation: { value: `E` } }
        ]
    };
    const circlarProg = {
        subPrograms: { SP: subProg },
        localChannels: [
            { name: "C1", type: "number" },
            { name: "C2", type: "number" }
        ],
        allen: {
            During: [
                {
                    programId: "SP",
                    as: "subP",
                    mapInputs: {
                        C: "C1",
                        E: "C2"
                    }
                }, {
                    contextName: "C2=C1",
                    state: `true`,
                    actions: [{ channel: "C2", affectation: { value: `C1` } }]
                }
            ]
        }
    };
    it("Should trigger an exception when loading circularProg", () => {
        expect(() => prog.loadHumanReadableProgram(circlarProg, env, {})).toThrow();
    });
});
describe("Direct circular dependencies detection:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const env = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const prog = new ProgramObject_1.CCBLProgramObject("progCircular", clock);
    const circlarBasic = {
        localChannels: [
            { name: "C1", type: "number" },
            { name: "C2", type: "number" }
        ],
        actions: [
            { channel: "C2", affectation: { value: `C1` } },
            { channel: "C1", affectation: { value: `C2` } }
        ]
    };
    it("Should trigger an exception when loading circlarBasic", () => {
        expect(() => prog.loadHumanReadableProgram(circlarBasic, env, {})).toThrow();
    });
});
describe("4 steps circular dependencies detection:", () => {
    const clock = new Clock_1.CCBLTestClock();
    const env = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const prog = new ProgramObject_1.CCBLProgramObject("progCircular", clock);
    const circlarBasic4 = {
        localChannels: [
            { name: "C1", type: "number" },
            { name: "C2", type: "number" },
            { name: "C3", type: "number" },
            { name: "C4", type: "number" },
        ],
        actions: [
            { channel: "C2", affectation: { value: `C1` } },
            { channel: "C3", affectation: { value: `C2` } },
            { channel: "C4", affectation: { value: `C3` } },
            { channel: "C1", affectation: { value: `C4` } }
        ]
    };
    it("Should trigger an exception when loading circlarBasic4", () => {
        expect(() => prog.loadHumanReadableProgram(circlarBasic4, env, {})).toThrow();
    });
});
//# sourceMappingURL=circularity.spec.js.map