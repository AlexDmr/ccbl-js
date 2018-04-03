"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootProgDescr_1 = {
    dependencies: {
        import: {
            emitters: [
                { name: "BobLocation", type: "LOCATION" },
                { name: "AliceLocation", type: "LOCATION" },
                { name: "AliceAvailable", type: "boolean" }
            ],
            channels: [
                { name: "lampAvatar", type: "COLOR" },
            ]
        }
    },
    localChannels: [
        { name: "BobAtHome", type: "boolean" },
        { name: "AliceAtHome", type: "boolean" },
        { name: "AliceAtBobHome", type: "boolean" }
    ],
    actions: [
        { channel: "BobAtHome", affectation: { type: "expression", value: `BobLocation == "Bob's home"` } },
        { channel: "AliceAtHome", affectation: { type: "expression", value: `AliceLocation == "Alice's home"` } },
        { channel: "AliceAtBobHome", affectation: { type: "expression", value: `AliceLocation == "Bob's home"` } },
        { channel: "lampAvatar", affectation: { type: "expression", value: `"off"` } },
    ]
};
//# sourceMappingURL=rootProg_1.js.map