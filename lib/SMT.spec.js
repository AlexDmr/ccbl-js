"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProgramObject_1 = require("./ProgramObject");
const Clock_1 = require("./Clock");
const ExecutionEnvironment_1 = require("./ExecutionEnvironment");
const EmitterValue_1 = require("./EmitterValue");
const Channel_1 = require("./Channel");
const SMT_1 = require("./SMT");
const P1 = {
    dependencies: {
        import: {
            channels: [
                { name: "C1", type: "number" },
                { name: "C2", type: "number" }
            ],
            emitters: [
                { name: "E1", type: "number" },
                { name: "E2", type: "number" },
                { name: "acc", type: "{x: number, y: number, z: number, meta: {alpha: boolean, beta: number}}" }
            ]
        }
    },
    localChannels: [
        { name: "CL", type: "boolean" }
    ],
    actions: [
        { channel: "C1", affectation: { value: "1" } },
        { channel: "C2", affectation: { value: "2" } }
    ],
    allen: {
        During: [
            {
                state: "E1 < 2*E2 and acc.x > 10",
                contextName: "ctxt_01",
                id: "E1min",
                actions: [
                    { channel: "C1", affectation: { value: "10" } },
                ],
                allen: {
                    During: [
                        {
                            state: "E1 > E2",
                            contextName: "ctxt_02",
                            id: "E1minmax",
                            actions: [
                                { channel: "C2", affectation: { value: "21" } }
                            ]
                        },
                        {
                            state: "E1 > 2*E2 and C2 < 20",
                            contextName: "ctxt_03",
                            id: "E1E2PBminmax",
                            actions: [
                                { channel: "C2", affectation: { value: "22" } }
                            ]
                        }
                    ]
                }
            }
        ]
    }
};
describe("SMT::", () => {
    const clock = new Clock_1.CCBLTestClock();
    const rootProg = new ProgramObject_1.CCBLProgramObject("rootProg", clock);
    const sourceEnv = new ExecutionEnvironment_1.CCBLEnvironmentExecution(clock);
    const E1 = new EmitterValue_1.CCBLEmitterValue(0);
    const E2 = new EmitterValue_1.CCBLEmitterValue(0);
    const acc = new EmitterValue_1.CCBLEmitterValue(undefined);
    const C1 = Channel_1.getNewChannel();
    const C2 = Channel_1.getNewChannel();
    sourceEnv.register_CCBLEmitterValue("E1", E1);
    sourceEnv.register_CCBLEmitterValue("E2", E2);
    sourceEnv.register_CCBLEmitterValue("acc", acc);
    sourceEnv.register_Channel("C1", C1);
    sourceEnv.register_Channel("C2", C2);
    it("should have the correct initial values", () => {
        rootProg.loadHumanReadableProgram(P1, sourceEnv, {});
        rootProg.activate();
        rootProg.UpdateChannelsActions();
        expect(rootProg.getValue("C1")).toEqual(1);
        expect(rootProg.getValue("C2")).toEqual(2);
    });
    it("should generate correct SMT", () => {
        const SMT = SMT_1.getContextSMTdescrFromProg(P1);
        expect(SMT).toBeDefined();
        console.log("SMT =", SMT);
    });
});
//# sourceMappingURL=SMT.spec.js.map