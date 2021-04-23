import { subProgOscillo } from "./subProgMappings";
export const subProgMapping2 = {
    dependencies: {
        import: {
            channels: [
                { name: "R", type: "number" },
                { name: "G", type: "number" },
                { name: "B", type: "number" },
                { name: "lamp", type: "color" },
            ],
            emitters: [
                { name: "temp", type: "number" },
                { name: "presenceBob", type: "boolean" },
                { name: "presenceAlice", type: "boolean" },
            ],
            events: [
                { name: "bt1", type: "boolean" },
                { name: "bt2", type: "boolean" }
            ]
        }
    },
    subPrograms: {
        OSCILLO: subProgOscillo
    },
    actions: [
        { channel: "R", affectation: { type: "expression", value: `0` } },
        { channel: "G", affectation: { type: "expression", value: `0` } },
        { channel: "B", affectation: { type: "expression", value: `0` } },
        { channel: "lamp", affectation: { type: "expression", value: `"black"` } }
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "Alice is there",
                state: "presenceAlice",
                actions: [
                    { channel: "R", affectation: { type: "expression", value: `oscilloR.val` } }
                ],
                allen: {
                    During: [
                        {
                            programId: "OSCILLO",
                            as: "oscilloR",
                            mapInputs: {
                                Vmin: "0",
                                Vmax: "255",
                                tps: "1000",
                                btStart: { eventSource: "bt1" },
                                btStop: { eventSource: "bt1" }
                            }
                        }
                    ]
                }
            }
        ]
    }
};
//# sourceMappingURL=subProgramMapping2.js.map