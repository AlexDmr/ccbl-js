import { CCBLProgramObject } from "./ProgramObject";
import { CCBLTestClock } from "./Clock";
import { CCBLEnvironmentExecution } from "./ExecutionEnvironment";
import { CCBLEmitterValue } from "./EmitterValue";
import { getNewChannel } from "./Channel";
import { getContextSMTdescrFromProg } from "./SMT";
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
            { type: "STATE",
                state: "E1 < 2*E2 and acc.x > 10",
                contextName: "ctxt_01",
                id: "E1min",
                actions: [
                    { channel: "C1", affectation: { value: "10" } },
                ],
                allen: {
                    During: [
                        { type: "STATE",
                            state: "E1 > E2",
                            contextName: "ctxt_02",
                            id: "E1minmax",
                            actions: [
                                { channel: "C2", affectation: { value: "21" } }
                            ]
                        },
                        { type: "STATE",
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
    const clock = new CCBLTestClock();
    const rootProg = new CCBLProgramObject("rootProg", clock);
    const sourceEnv = new CCBLEnvironmentExecution(clock);
    const E1 = new CCBLEmitterValue(0);
    const E2 = new CCBLEmitterValue(0);
    const acc = new CCBLEmitterValue(undefined);
    const C1 = getNewChannel(undefined);
    const C2 = getNewChannel(undefined);
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
        const SMT = getContextSMTdescrFromProg(P1);
        expect(SMT).toBeDefined();
        console.log("SMT =", SMT);
    });
});
//# sourceMappingURL=SMT.spec.js.map