"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parentProg = exports.subProgOscillo = void 0;
exports.subProgOscillo = {
    dependencies: {
        import: {
            emitters: [
                { name: "Vmin", type: "number" },
                { name: "Vmax", type: "number" },
                { name: "tps", type: "number" }
            ],
            events: [
                { name: "btStart", type: "boolean" },
                { name: "btStop", type: "boolean" }
            ]
        },
        export: {
            emitters: [
                { name: "val", type: "number" },
                { name: "log", type: "string" }
            ]
        }
    },
    actions: [
        { channel: "val", affectation: { type: "expression", value: `Vmin` } },
        { channel: "log", affectation: { type: "expression", value: `"root"` } }
    ],
    allen: {
        During: [
            {
                contextName: "subProgRootFirst",
                state: "true",
                eventStart: { eventSource: "btStart", id: "start trigger" },
                eventFinish: { eventSource: "btStop", id: "stop trigger" },
                id: "state root subprog Oscillo",
                allen: {
                    During: [
                        {
                            contextName: "Up",
                            state: "true; false; tps; waitEnd",
                            id: "reset event context",
                            actions: [
                                { channel: "val", affectation: { type: "expression", value: "Vmin; Vmax; tps; linear" } },
                                { channel: "log", affectation: { type: "expression", value: `"Up"` } }
                            ],
                            allen: {
                                Meet: {
                                    loop: 0,
                                    contextsSequence: [
                                        {
                                            contextName: "Down",
                                            state: "true; false; tps; waitEnd",
                                            actions: [
                                                { channel: "val", affectation: { type: "expression", value: "Vmax; Vmin; tps; linear" } },
                                                { channel: "log", affectation: { type: "expression", value: `"Down"` } }
                                            ],
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        ]
    }
};
exports.parentProg = {
    dependencies: {
        import: {
            emitters: [
                { name: "A", type: "number" },
                { name: "B", type: "number" },
            ],
            events: [
                { name: "evt1", type: "number" }
            ]
        }
    },
    localChannels: [
        { name: "C1", type: "number" },
        { name: "C2", type: "number" }
    ],
    actions: [
        { id: "op1", channel: "C1", affectation: { type: "expression", value: `oscillo1.val` } },
        { id: "op2", channel: "C2", affectation: { type: "expression", value: `0` } }
    ],
    subPrograms: {
        oscillo: exports.subProgOscillo
    },
    allen: {
        During: [
            {
                programId: "oscillo",
                as: "oscillo1",
                id: "oscillo1",
                mapInputs: {
                    Vmin: "0",
                    Vmax: "100",
                    tps: "1000",
                    btStart: { eventSource: "evt1", eventFilter: "event.value >= 0" },
                    btStop: { eventSource: "evt1", eventFilter: "event.value >= 0" }
                }
            },
            {
                eventSource: "evt1",
                eventFilter: "false",
                contextName: "pipo evt context",
                id: "pipo evt",
                actions: [
                    { channel: "C1", affectation: "0", id: "yo" }
                ]
            }
        ]
    }
};
//# sourceMappingURL=subProgMappings.js.map