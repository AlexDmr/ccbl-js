import { domicube } from "./domicube";
export const domicubePlus = {
    subPrograms: { Domicube: domicube },
    dependencies: {
        import: {
            emitters: [
                { name: "gyro", type: "{alpha, beta, gamma}" },
                { name: "acc", type: "{x, y, z}" }
            ],
            events: [
                { name: "btToggleAvatarOnOff", type: "string" },
                { name: "resetVolume", type: "string" },
                { name: "muteVolume", type: "string" }
            ]
        }
    },
    localChannels: [
        { name: "lampAvatar", type: "COLOR" },
        { name: "Volume", type: "percentage" },
        { name: "rotation", type: "ClockWiseOrNot" },
        { name: "face", type: "CubeFace" },
        { name: "log", type: "string" },
        { name: "Channel", type: "number" },
        { name: "N", type: "number" },
        { name: "Concurrency", type: "number" }
    ],
    actions: [
        { channel: "lampAvatar", affectation: { value: `"#fff"` } },
        { channel: "Volume", affectation: { value: `0` } },
        { channel: "Channel", affectation: { value: `1` } },
        { channel: "rotation", affectation: { value: `DomicubeBase.rotation` } },
        { channel: "face", affectation: { value: `DomicubeBase.face` } },
        { channel: "log", affectation: { value: `"at root level"` } },
        { channel: "N", affectation: { value: `0` } },
        { channel: "Concurrency", affectation: { value: `0` } },
    ],
    allen: {
        During: [
            { type: "STATE",
                contextName: "DomiFace1",
                state: `DomicubeBase.face == 1`,
                actions: [{ channel: "log", affectation: { value: `"DomicubeBase.face == 1"` } }],
                allen: {
                    During: [{ type: "STATE",
                            contextName: "RotationClockWise",
                            state: `DomicubeBase.rotation == "clockwise"`,
                            actions: [{ channel: "log", affectation: { value: `"DomicubeBase.rotation == clockwise"` } }],
                            allen: {
                                During: [{ type: "STATE",
                                        contextName: "IncreaseVolume",
                                        state: "true; false; 10; waitEnd",
                                        actions: [{ channel: "log", affectation: { value: `"IncreaseVolume"` } }],
                                        actionsOnStart: [
                                            { channel: "N", affectation: "N + 1" }
                                        ],
                                        actionsOnEnd: [
                                            { channel: "Volume", affectation: "Volume + 1" }
                                        ],
                                        allen: {
                                            Meet: {
                                                contextsSequence: [],
                                                loop: 0
                                            }
                                        }
                                    }]
                            }
                        }, { type: "STATE",
                            contextName: "RotationAntiClockWise",
                            state: `DomicubeBase.rotation == "anticlockwise"`,
                            actions: [{ channel: "log", affectation: { value: `"DomicubeBase.rotation == anticlockwise"` } }],
                            allen: {
                                During: [{ type: "STATE",
                                        contextName: "DecreaseVolume",
                                        state: "true; false; 10; waitEnd",
                                        actions: [{ channel: "log", affectation: { value: `"DecreaseVolume"` } }],
                                        actionsOnStart: [
                                            { channel: "N", affectation: "N + 1" }
                                        ],
                                        actionsOnEnd: [
                                            { channel: "Volume", affectation: "Volume - 1" }
                                        ],
                                        allen: {
                                            Meet: {
                                                contextsSequence: [],
                                                loop: 0
                                            }
                                        }
                                    }]
                            }
                        }
                    ]
                }
            }, { type: "STATE",
                contextName: "DomiFace2",
                state: `DomicubeBase.face == 2`,
                actions: [{ channel: "log", affectation: { value: `"DomicubeBase.face == 2"` } }],
                allen: {
                    During: [{ type: "STATE",
                            contextName: "ChannelRotationClockWise",
                            state: `DomicubeBase.rotation == "clockwise"`,
                            actions: [{ channel: "log", affectation: { value: `"DomicubeBase.rotation == clockwise"` } }],
                            allen: {
                                During: [{ type: "STATE",
                                        contextName: "ChannelIncreaseChannel",
                                        state: "true; false; 10; waitEnd",
                                        actions: [{ channel: "log", affectation: { value: `"IncreaseChannel"` } }],
                                        actionsOnStart: [
                                            { channel: "N", affectation: "N + 1" }
                                        ],
                                        actionsOnEnd: [
                                            { channel: "Channel", affectation: "Channel + 1" }
                                        ],
                                        allen: {
                                            Meet: {
                                                contextsSequence: [],
                                                loop: 0
                                            }
                                        }
                                    }]
                            }
                        }, { type: "STATE",
                            contextName: "ChannelRotationAntiClockWise",
                            state: `DomicubeBase.rotation == "anticlockwise"`,
                            actions: [{ channel: "log", affectation: { value: `"DomicubeBase.rotation == anticlockwise"` } }],
                            allen: {
                                During: [{ type: "STATE",
                                        contextName: "ChannelDecreaseChannel",
                                        state: "true; false; 10; waitEnd",
                                        actions: [{ channel: "log", affectation: { value: `"DecreaseChannel"` } }],
                                        actionsOnStart: [
                                            { channel: "N", affectation: "N + 1" }
                                        ],
                                        actionsOnEnd: [
                                            { channel: "Channel", affectation: "Channel - 1" }
                                        ],
                                        allen: {
                                            Meet: {
                                                contextsSequence: [],
                                                loop: 0
                                            }
                                        }
                                    }]
                            }
                        }]
                }
            },
            { type: "EVENT",
                contextName: "Reset",
                eventSource: "resetVolume",
                actions: [{ channel: "Volume", affectation: "Volume; 100; 100; linear" }]
            }, { type: "EVENT",
                contextName: "Mute",
                eventSource: "muteVolume",
                actions: [{ channel: "Volume", affectation: `-1` }]
            }, { type: "STATE",
                contextName: "constraints",
                state: "true",
                actions: [
                    { channel: "Volume", affectation: { type: "constraint", value: "min(100, max(0, Volume))" } }
                ]
            }, {
                programId: "Domicube",
                as: "DomicubeBase",
                mapInputs: {}
            }
        ]
    }
};
//# sourceMappingURL=DomicubeUsage.js.map