"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domicube_1 = require("./domicube");
exports.domicubePlus = {
    subPrograms: { Domicube: domicube_1.domicube },
    dependencies: {
        import: {
            emitters: [
                { name: "gyro", type: "{alpha, beta, gamma}" },
                { name: "acc", type: "{x, y, z}" }
            ],
            events: [
                { name: "btToggleAvatarOnOff", type: "string" }
            ]
        }
    },
    localChannels: [
        { name: "lampAvatar", type: "COLOR" },
        { name: "Volume", type: "percentage" },
        { name: "rotation", type: "ClockWiseOrNot" },
        { name: "face", type: "CubeFace" },
        { name: "log", type: "string" },
        { name: "N", type: "number" }
    ],
    actions: [
        { channel: "lampAvatar", affectation: { value: `"#fff"` } },
        { channel: "Volume", affectation: { value: `0` } },
        { channel: "rotation", affectation: { value: `DomicubeBase__rotation` } },
        { channel: "face", affectation: { value: `DomicubeBase__face` } },
        { channel: "log", affectation: { value: `"at root level"` } },
        { channel: "N", affectation: { value: `0` } }
    ],
    allen: {
        During: [
            {
                programId: "Domicube",
                as: "DomicubeBase",
                mapInputs: {}
            }, {
                contextName: "DomiFace1",
                state: `DomicubeBase__face == 1`,
                actions: [{ channel: "log", affectation: { value: `"DomicubeBase__face == 1"` } }],
                allen: {
                    During: [{
                            contextName: "RotationClockWise",
                            state: `DomicubeBase__rotation == "clockwise"`,
                            actions: [{ channel: "log", affectation: { value: `"DomicubeBase__rotation == clockwise"` } }],
                            allen: {
                                During: [{
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
                        }]
                }
            }
        ]
    }
};
//# sourceMappingURL=DomicubeUsage.js.map