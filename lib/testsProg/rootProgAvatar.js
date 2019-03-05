"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootProgAvatar = {
    dependencies: {
        import: {
            channels: [
                { name: "lampAvatar", type: "color" }
            ],
            emitters: [
                { name: "BobAtHome", type: "boolean" },
                { name: "AliceAtHome", type: "boolean" },
                { name: "AliceAtBobHome", type: "boolean" },
                { name: "AliceAvailable", type: "boolean" },
                { name: "securityMode", type: "boolean" }
            ]
        },
        export: {
            channels: [
                { name: "MusicMode", type: "string" }
            ]
        }
    },
    actions: [
        { channel: "lampAvatar", affectation: { value: `"off"` } },
        { channel: "MusicMode", affectation: { value: `"off"` } }
    ],
    allen: {
        During: [
            {
                contextName: "rootProgChild",
                state: "true"
            },
            {
                contextName: "security",
                state: "securityMode"
            }
        ]
    }
};
//# sourceMappingURL=rootProgAvatar.js.map